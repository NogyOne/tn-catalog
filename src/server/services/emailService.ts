import type { EmailType } from "@/consts/emailTypes";
import { getEmailTemplate } from "@/helpers/emailHelper";
import type { EmailData } from "@/types/email";
import nodemailer from "nodemailer";

export class EmailService {
  transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: import.meta.env.EMAIL,
        pass: import.meta.env.EMAIL_PASS,
      },
    });

    this.transporter.verify((error: Error | null, success: boolean) => {
      if (error) {
        console.error(
          "[EMAIL-SERVICE]-Error verifying email transporter:",
          error
        );
      } else {
        console.log("Email transporter is ready to send messages.");
      }
    });
  }

  public async sendEmail(type: EmailType, data: EmailData) {
    try {
      const emailOptions = getEmailTemplate(type, data);
      const info = await this.transporter.sendMail(emailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("[EMAIL-SERVICE]-Error sending email:", error);
      throw new Error("[EMAIL-SERVICE]-Failed to send email");
    }
  }
}
