"use server";

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

  const user = await db.select().from(usersTable).where(eq(usersTable.id, payload.userId)).then(r => r[0]);
  return Response.json({ user });
}