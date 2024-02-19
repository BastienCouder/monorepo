'use server';

import { Resend } from 'resend';
import { env } from '../env';

const domain = env.NEXTAUTH_URL;
const domainEmail = 'Acme <onboarding@resend.dev>';

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string,
  resend: Resend
) => {
  await resend.emails.send({
    from: domainEmail,
    to: email,
    subject: '2FA Code',
    html: `Ceci est le corps de l'email en texte. Your 2FA code: ${token}`,
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
  resend: Resend
) => {
  const resetLink = `${domain}/new-password?token=${token}`;

  await resend.emails.send({
    from: domainEmail,
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
};

export const sendVerificationEmail = async (
  email: string,
  token: string,
  resend: Resend
) => {
  const confirmLink = `${domain}/new-verification?token=${token}`;

  await resend.emails.send({
    from: domainEmail,
    to: email,
    subject: 'Confirm your email',
    html: `Click "${confirmLink}">here to confirm email.</p>`,
  });
};
