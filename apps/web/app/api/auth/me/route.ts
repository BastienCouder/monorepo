import { cookies } from 'next/headers';
import { verifyToken } from '@repo/auth';
import { db } from 'db';
import { eq } from 'drizzle-orm';
import { usersTable } from 'db/schema';

export async function GET() {
  const token = (await cookies()).get('accessToken')?.value;
  if (!token) return new Response('Unauthorized', { status: 401 });

  const payload = verifyToken(token);
  if (!payload) return new Response('Unauthorized', { status: 401 });

  const user = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      name: usersTable.name,
      role: usersTable.role,
      createdAt: usersTable.createdAt,
    })
    .from(usersTable)
    .where(eq(usersTable.id, payload.userId))
    .then(r => r[0]);

  if (!user) return new Response('User not found', { status: 404 });

  return Response.json({ user });
}