import { emailTemplates } from "@lib/emailTemplates";
import type { EmailData } from "@/types/email";
import type { EmailType } from "@/consts/emailTypes";
import { EmailTypes } from "@/consts/emailTypes";

export function getEmailTemplate(type: EmailType, data: EmailData) {
  switch (type) {
    case EmailTypes.SUPPORT:
      return emailTemplates.mailFromSupport(data);
    default:
      const _exhaustiveCheck: never = type;
      throw new Error(`Email template of type ${type} not found`);
  }
}
