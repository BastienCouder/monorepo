'use server';
import { env } from '@/env.mjs';
import { Resend } from 'resend';

const domainEmail = 'Acme <onboarding@resend.dev>';

const resend = new Resend(env.RESEND_API_KEY);

const domain = env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: domainEmail,
    to: email,
    subject: '2FA Code',
    html: `<p>Your 2FA code: ${token}</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/new-password?token=${token}`;

  await resend.emails.send({
    from: domainEmail,
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/new-verification?token=${token}`;

  await resend.emails.send({
    from: domainEmail,
    to: email,
    subject: 'Confirm your email',
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
};

export const sendTeamInvitationEmail = async (
  email: string,
  teamSlug: string,
  teamKey: string
) => {
  const invitationLink = `${process.env.DOMAIN}/join-team?teamSlug=${teamSlug}&key=${teamKey}`;

  await resend.emails.send({
    from: domainEmail,
    to: email,
    subject: 'You are invited to join the team',
    html: `<p>You have been invited to join the team. Click <a href="${invitationLink}">here</a> to accept the invitation. Use the following key when prompted: <strong>${teamKey}</strong></p>`,
  });
};
