import * as nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, text: string) => {
  const isGmail =
    process.env.EMAIL_HOST?.includes("gmail") ||
    process.env.EMAIL_USER?.includes("@gmail.com");

  const transporter = nodemailer.createTransport(
    isGmail
      ? {
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        }
      : {
          host: process.env.EMAIL_HOST || "smtp.gmail.com",
          port: Number(process.env.EMAIL_PORT) || 587,
          secure: Number(process.env.EMAIL_PORT) === 465,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
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
    console.log("📧 Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};
