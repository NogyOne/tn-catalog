export const EmailTypes = {
  SUPPORT: "mailFromSupport",
} as const;

export type EmailType = (typeof EmailTypes)[keyof typeof EmailTypes];
