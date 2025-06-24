import type { EmailTemplate, EmailData } from "@/types/email";

// type email = {
//   subject: string;
//   body: string;
//   from: string;
//   to: string;
// };

export const emailTemplates = {
  mailFromSupport: (data: EmailData) => {
    return {
      from: data.from,
      to: data.to ?? import.meta.env.EMAIL,
      subject: data.subject,
      html: `<h1>Mensaje desde Soporte</h1></br>
      <p>Enviado por: <i>${data.name} Email:${data.from}</i></p>
     </br><p> ${data.message}</p>`,
    };
  },
};
