import { Injectable, NotFoundException } from "@nestjs/common";
import { CommentRepository } from "./comment.repository";
import { CreateCommentDto } from "./comment.dto";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";
import { sendTelegramMessage } from "../../utils/telegram";
import axios from "axios";

@Injectable()
export class CommentService {
  private readonly OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434/api/chat";
  private readonly MODEL_NAME = process.env.OLLAMA_MODEL || "gemma3:4b";

  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async checkAndSendTelegramAlert(content: string) {
    if (!content) return;

    let isNegative = false;
    let summary = "";
    let aiReply = "";

    const lower = content.toLowerCase();
    const negativeKeywords = ["dở", "mặn", "chậm", "kém", "xấu", "tệ", "bẩn", "thái độ", "không ngon", "thất vọng", "lâu", "ngọt quá"];
    
    // Kiểm tra từ khóa nhanh offline
    if (negativeKeywords.some((kw) => lower.includes(kw))) {
      isNegative = true;
    }

    try {
      const prompt = `Bạn là hệ thống kiểm duyệt và phân tích chất lượng dịch vụ nhà hàng.
Hãy đọc nội dung phản hồi của khách hàng sau đây: "${content}"

Nhiệm vụ:
1. Đánh giá đây có phải là phản hồi mang tính KHUYẾT ĐIỂM / TIÊU CỰC / CHÊ BÀI / KHIẾU NẠI hay không (trả về isNegative: true hoặc false). Các phản hồi chê đồ ăn dở, mặn, ngọt quá, phục vụ chậm, dơ hổi, thái độ kém... đều tính là khuyết điểm (isNegative: true).
2. Tóm tắt ngắn gọn nội dung khuyết điểm (nếu có) trong 1 câu.
3. Soạn câu trả lời cảm ơn hoặc xin lỗi lịch sự đại diện nhà hàng.

Trả về JSON thuần túy (không kèm văn bản khác ngoài JSON):
{
  "isNegative": true,
  "summary": "Tóm tắt ngắn gọn",
  "aiReply": "Lời xin lỗi/cảm ơn từ nhà hàng"
}`;

      const response = await axios.post(
        this.OLLAMA_URL,
        {
          model: this.MODEL_NAME,
          messages: [{ role: "user", content: prompt }],
          stream: false,
          options: {
            temperature: 0.1,
            num_predict: 256,
          },
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 45000, // Tăng timeout lên 45 giây để Ollama có đủ thời gian phản hồi
        }
      );

      const aiContent = response.data?.message?.content || "";
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.isNegative !== undefined) {
          isNegative = Boolean(parsed.isNegative);
        }
        summary = parsed.summary || "";
        aiReply = parsed.aiReply || "";
      } else {
        aiReply = aiContent;
      }
    } catch (error: any) {
      console.warn("[AI Moderation Warning]:", error.message);
    }

    // Đếm tổng số bài khuyết điểm trong 7 ngày qua
    const weeklyComments = await this.commentRepository.getWeeklyComments();
    let weeklyNegativeCount = 0;

    for (const c of weeklyComments) {
      const contentLower = c.content.toLowerCase();
      if (negativeKeywords.some((kw) => contentLower.includes(kw))) {
        weeklyNegativeCount++;
      }
    }

    if (isNegative && weeklyNegativeCount === 0) {
      weeklyNegativeCount = 1;
    }

    // Gửi cảnh báo Telegram
    if (isNegative && weeklyNegativeCount >= 3) {
      const urgentMessage = `🚨 <b>CẢNH BÁO KHẨN CẤP: ĐÃ ĐẠT ${weeklyNegativeCount} PHẢN HỒI KHUYẾT ĐIỂM TRONG TUẦN!</b>
----------------------------------------
📌 <b>Nội dung vừa nhận:</b> ${content}
🤖 <b>Tóm tắt AI:</b> ${summary || "Phản hồi có khuyết điểm về dịch vụ/món ăn"}
⚠️ <b>Thống kê:</b> Đã có <b>${weeklyNegativeCount} bài phản hồi tiêu cực/khuyết điểm</b> trong 7 ngày gần đây!
👉 Ban quản lý vui lòng kiểm tra quy trình nhà hàng và xử lý ngay!`;

      sendTelegramMessage(urgentMessage).catch((err) => console.error("Telegram Error:", err));
    } else {
      const teleMessage = `💬 <b>BÀI ĐĂNG / PHẢN HỒI MỚI</b>
----------------------------------------
<b>Nội dung:</b> ${content}
${isNegative ? "⚠️ <i>Được gắn nhãn: Ghi nhận khuyết điểm</i>" : "✨ <i>Được gắn nhãn: Tích cực/Đóng góp</i>"}
🤖 <b>AI Trả lời:</b> ${aiReply || "Cảm ơn bạn đã đóng góp ý kiến!"}
📊 <i>Số bài khuyết điểm tuần này: ${weeklyNegativeCount}/3</i>`;

      sendTelegramMessage(teleMessage).catch((err) => console.error("Telegram Error:", err));
    }
  }

  async createComment(data: CreateCommentDto, file?: Express.Multer.File) {
    if (file) {
      try {
        data.imageUrl = await this.cloudinaryService.uploadFile(file);
      } catch (error) {}
    }
    const created = await this.commentRepository.createComment(data);

    if (data.content) {
      this.checkAndSendTelegramAlert(data.content).catch((err) =>
        console.error("Telegram Error:", err)
      );
    }

    return created;
  }

  async getComments(params?: {
    skip?: number;
    take?: number;
    cursor?: any;
    where?: any;
    orderBy?: any;
  }) {
    const [comments, total] = await Promise.all([
      this.commentRepository.getComments(params),
      this.commentRepository.countComments(params?.where),
    ]);

    return {
      data: comments,
      total,
      skip: params?.skip || 0,
      take: params?.take || comments.length,
    };
  }

  async getCommentById(id: string) {
    const comment = await this.commentRepository.getCommentById(id);
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  async getCommentsByUserId(userId: string) {
    return this.commentRepository.getCommentsByUserId(userId);
  }

  async updateComment(id: string, data: Partial<CreateCommentDto>, file?: Express.Multer.File) {
    await this.getCommentById(id);

    if (file) {
      data.imageUrl = await this.cloudinaryService.uploadFile(file);
    }

    const updated = await this.commentRepository.updateComment(id, data);

    if (data.content) {
      this.checkAndSendTelegramAlert(data.content).catch((err) =>
        console.error("Telegram Error:", err)
      );
    }

    return updated;
  }

  async deleteComment(id: string) {
    await this.getCommentById(id);
    return this.commentRepository.deleteComment(id);
  }

  async uploadImage(file: Express.Multer.File) {
    return this.cloudinaryService.uploadFile(file);
  }

  async countComments(where?: any) {
    return this.commentRepository.countComments(where);
  }

  async sendFeedback(data: CreateCommentDto) {
    const savedComment = await this.commentRepository.sendFeedback(data);

    if (data.content) {
      this.checkAndSendTelegramAlert(data.content).catch((err) =>
        console.error("Telegram Error:", err)
      );
    }

    return {
      success: true,
      comment: savedComment,
    };
  }
}
