import type { EmailData } from "@/types/email";
import { EmailService } from "@services/emailService";
import { isValidEmail, validateForm } from "@/lib/utils";
import type { EmailType } from "@/consts/emailTypes";

export class EmailController {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  public async handleSendEmail(type: EmailType, data: EmailData) {
    if (!type || !data) {
      throw new Error(
        "[EMAIL-CONTROLLER]-Type and data fields are required to send an email."
      );
    }

    if (!isValidEmail(data.from)) {
      throw new Error("Invalid email format address.");
    }

    if (data.from === "tiemponoblemx@gmail.com") {
      throw new Error("Corre no permitido. Prueba con otro.");
    }

    if (!validateForm([data.name, data.from, data.subject, data.message])) {
      throw new Error("All Fields are required.");
    }

    try {
      // console.log(type, data);
      const response = await this.emailService.sendEmail(type, data);
      return response;
    } catch (error) {
      //   console.error("Error in EmailController.sendEmail:", error);
      throw new Error("Failed to send email: " + error);
    }
  }
}
