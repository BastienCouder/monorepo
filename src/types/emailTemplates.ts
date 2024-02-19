export interface EmailTemplateProps {
  email: string;
  token: string;
}

export type EmailTemplateFunc = (props: EmailTemplateProps) => Promise<void>;
