import * as nodemailer from "nodemailer";
import { Resend } from "resend";

export const sendEmail = async (to: string, subject: string, text: string) => {
  // 1. Ưu tiên dùng Resend (HTTP API) - 100% hoạt động trên Render Cloud vì dùng cổng HTTPS 443
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { data, error } = await resend.emails.send({
        from: "Restaurant Booking <onboarding@resend.dev>",
        to: [to],
        subject,
        text,
      });
      if (error) {
        console.error("❌ Resend API Error:", error);
      } else {
        console.log("📧 Email sent via Resend API:", data?.id);
      }
      return data;
    } catch (resendErr) {
      console.error("❌ Resend Exception:", resendErr);
    }
  }

  // 2. Dự phòng Nodemailer SMTP (Dùng cho Local)
  const isGmail =
    process.env.EMAIL_HOST?.includes("gmail") ||
    process.env.EMAIL_USER?.includes("@gmail.com");

  const transporter = nodemailer.createTransport(
    isGmail
      ? {
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
          tls: {
            rejectUnauthorized: false,
          },
        }
      : {
          host: process.env.EMAIL_HOST || "smtp.gmail.com",
          port: Number(process.env.EMAIL_PORT) || 465,
          secure: Number(process.env.EMAIL_PORT) === 465,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
  );

  const mailOptions = {
    from: `"Restaurant Booking" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent via Nodemailer: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};
