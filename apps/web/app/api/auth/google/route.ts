import { OAuth2Client } from 'google-auth-library';
import { cookies } from 'next/headers';
import { db } from 'db';
import { usersTable, sessionsTable } from 'db/schema';
import { eq } from 'drizzle-orm';
import { signAccessToken, signRefreshToken } from '@repo/auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  let redirect = '/';

  try {
    const state = searchParams.get('state');
    if (state) {
      const parsed = JSON.parse(state);
      if (parsed?.redirect && typeof parsed.redirect === 'string' && parsed.redirect.startsWith('/')) {
        redirect = parsed.redirect;
      }
    }
  } catch {
    console.error('Invalid state parameter');
  }

  if (!code) return new Response('Missing Google code', { status: 400 });

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: 'authorization_code',
    }),
  });

  const { id_token } = await tokenRes.json();
  if (!id_token) return new Response('Google auth failed', { status: 401 });

  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) return new Response('Invalid token', { status: 403 });

  let user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, payload.email))
    .then(r => r[0]);

  if (!user) {
    user = await db
      .insert(usersTable)
      .values({
        email: payload.email,
        name: payload.name ?? '',
        password: '',
        role: 'user',
      })
      .returning()
      .then(r => r[0]);
  }

  if (!user?.id || !user?.role) {
    return new Response('User creation failed', { status: 500 });
  }

  const accessToken = signAccessToken({ userId: user.id, roles: [user.role] });
  const refreshToken = signRefreshToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  await db.insert(sessionsTable).values({
    userId: user.id,
    refreshToken,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set('accessToken', accessToken, { httpOnly: true, maxAge: 900, path: '/' });
  cookieStore.set('refreshToken', refreshToken, { httpOnly: true, maxAge: 60 * 60 * 24 * 30, path: '/' });

  return new Response(null, {
    status: 302,
    headers: {
      Location: redirect,
    },
  });
}