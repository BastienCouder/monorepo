import { currentRole } from '@/lib/authCheck';
import { UserRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  const role = await currentRole();

  if (role === UserRole.ADMINISTRATOR) {
    return new NextResponse(null, { status: 200 });
  }

  return new NextResponse(null, { status: 403 });
}
