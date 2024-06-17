'use server';

import { currentUser } from '@/lib/auth';
import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

interface DeleteGroupResponse {
  success?: string;
  error?: string;
}

export async function deleteGroup(
  teamId: string,
  userId: string
): Promise<DeleteGroupResponse> {
  const user = await currentUser();

  if (!user) {
    return {
      error: 'You are not authorized to perform this action.',
    };
  }

  if (user.id !== userId) {
    return {
      error:
        'You do not have the necessary permissions to perform this action.',
    };
  }

  const team = await db.team.findUnique({
    where: { id: teamId },
  });

  if (!team) {
    return {
      error: 'Team not found.',
    };
  }

  const teamMember = await db.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId: teamId,
        userId: userId,
      },
    },
  });

  if (!teamMember || teamMember.role !== 'OWNER') {
    return {
      error: 'You are not authorized to delete this team.',
    };
  }

  await db.$transaction(async (prisma) => {
    const rootFolders = await prisma.folder.findMany({
      where: { teamId: teamId, parentId: null },
    });

    for (const folder of rootFolders) {
      await deleteFolderContents(folder.id);
      await prisma.folder.delete({ where: { id: folder.id } });
    }

    await prisma.file.deleteMany({
      where: { teamId: teamId, folderId: null },
    });

    await prisma.team.delete({ where: { id: teamId } });
  });

  revalidatePath('/dashboard');

  return { success: 'Team deleted successfully.' };
}

async function deleteFolderContents(folderId: string) {
  const subfolders = await db.folder.findMany({
    where: { parentId: folderId },
  });

  for (const subfolder of subfolders) {
    await deleteFolderContents(subfolder.id);
    await db.folder.delete({ where: { id: subfolder.id } });
  }

  const files = await db.file.findMany({
    where: { folderId: folderId },
  });

  for (const file of files) {
    await db.file.delete({ where: { id: file.id } });
  }
}
