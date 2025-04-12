import { cookies } from 'next/headers';
import { refreshTokens } from '@repo/auth';

export async function POST() {
  const oldRefreshToken = (await cookies()).get('refreshToken')?.value;
  if (!oldRefreshToken) return new Response('Forbidden', { status: 403 });

  const result = await refreshTokens(oldRefreshToken);
  if (!result) return new Response('Forbidden', { status: 403 });

  (await cookies()).set('accessToken', result.accessToken, {
    httpOnly: true,
    maxAge: 900,
    path: '/',
  });
  (await cookies()).set('refreshToken', result.refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}