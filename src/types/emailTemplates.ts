export interface EmailTemplateProps {
  email: string;
  token: string;
}

// eslint-disable-next-line no-unused-vars
export type EmailTemplateFunc = (props: EmailTemplateProps) => Promise<void>;
