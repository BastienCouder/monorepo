import jwt from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';

import { db } from '../../apps/web/db';
import { usersTable, sessionsTable } from '../../apps/web/db/schema';

export const JWT_SECRET = process.env.JWT_SECRET ?? 'dev_secret';
export const ACCESS_TOKEN_EXPIRY = '15m';
export const REFRESH_TOKEN_EXPIRY = 60 * 60 * 24 * 30 * 1000;

export interface AuthPayload {
  userId: number;
  roles: string[];
}

function randomUUID() {
  return crypto.randomUUID();
}

export async function registerUser(email: string, password: string) {
  const hashed = await hash(password, 10);
  await db.insert(usersTable).values({ email, password: hashed });
  return { success: true };
}

export async function loginUser(email: string, password: string) {
  const user = await db.select().from(usersTable).where(eq(usersTable.email, email)).then(r => r[0]);
  if (!user || !(await compare(password, user.password))) {
    return { error: 'Invalid credentials' };
  }
  if (!user.role) return { error: 'User has no role' };
  const accessToken = signAccessToken({ userId: user.id, roles: [user.role] });
  const refreshToken = signRefreshToken();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY);

  await db.insert(sessionsTable).values({ userId: user.id, refreshToken, expiresAt });
  return { accessToken, refreshToken };
}

export async function logoutUser(refreshToken: string) {
  await db.delete(sessionsTable).where(eq(sessionsTable.refreshToken, refreshToken));
  return { success: true };
}

export function signAccessToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export function signRefreshToken(): string {
  return randomUUID();
}

export function verifyToken<T = AuthPayload>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch {
    return null;
  }
}

export async function refreshTokens(oldRefreshToken: string) {
  const session = await db
    .select({
      session: sessionsTable,
      userRole: usersTable.role,
    })
    .from(sessionsTable)
    .innerJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
    .where(eq(sessionsTable.refreshToken, oldRefreshToken))
    .then(r => r[0]);

  if (!session || new Date(session.session.expiresAt) < new Date()) return null;

  if (!session.userRole) return null;

  await db.delete(sessionsTable).where(eq(sessionsTable.refreshToken, oldRefreshToken));

  const newRefreshToken = signRefreshToken();
  const newExpiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY);

  await db.insert(sessionsTable).values({
    userId: session.session.userId,
    refreshToken: newRefreshToken,
    expiresAt: newExpiresAt,
  });

  const accessToken = signAccessToken({
    userId: Number(session.session.userId),
    roles: [session.userRole],
  });

  return { accessToken, refreshToken: newRefreshToken };
}
