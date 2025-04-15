import { cookies } from 'next/headers';
import { logoutUser } from '@repo/auth';

export async function POST() {
  const refreshToken = (await cookies()).get('refreshToken')?.value;
  if (refreshToken) await logoutUser(refreshToken);

  (await cookies()).set('accessToken', '', { maxAge: 0 });
  (await cookies()).set('refreshToken', '', { maxAge: 0 });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}