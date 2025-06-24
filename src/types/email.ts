export type EmailTemplate = {
  type: string;
  data: EmailData;
};

export type EmailData = {
  message: string;
  subject: string;
  from: string;
  name: string;
  to: string;
};
