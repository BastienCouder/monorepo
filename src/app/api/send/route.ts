import {
  sendPasswordResetEmail,
  sendTwoFactorTokenEmail,
  sendVerificationEmail,
} from '@/lib/email/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { type, email, token } = req.body;

  try {
    switch (type) {
      case '2FA':
        await sendTwoFactorTokenEmail(email, token, resend);
        break;
      case 'resetPassword':
        await sendPasswordResetEmail(email, token, resend);
        break;
      case 'verifyEmail':
        await sendVerificationEmail(email, token, resend);
        break;
      default:
        throw new Error('Invalid email request type');
    }
    return Response.json('success');
  } catch (error) {
    return Response.json({ error });
  }
}
