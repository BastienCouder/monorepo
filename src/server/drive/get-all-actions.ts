'use server';

import { db } from '@/lib/prisma';
import { Action } from '@prisma/client';

export async function getAllUserActionsForTeam(
  teamId: string
): Promise<Action[]> {
  try {
    const actions = await db.action.findMany({
      where: { teamId },
      orderBy: { timestamp: 'desc' },
    });
    return actions;
  } catch (error) {
    console.error('Error fetching user actions for team:', error);
    throw error;
  }
}
