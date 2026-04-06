import { Injectable, NotFoundException } from "@nestjs/common";
import { CommentRepository } from "./comment.repository";
import { CreateCommentDto } from "./comment.dto";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";

@Injectable()
export class CommentService {
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async createComment(data: CreateCommentDto, file?: Express.Multer.File) {
        if (file) {
            try {
                data.imageUrl = await this.cloudinaryService.uploadFile(file);
            } catch (error) {}
        }
        return this.commentRepository.createComment(data);
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

        return this.commentRepository.updateComment(id, data);
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
}
