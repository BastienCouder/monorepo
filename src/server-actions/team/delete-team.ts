'use server';
import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const deleteTeam = async (teamId: string, userId: string) => {
  const team = await db.team.findUnique({ where: { id: teamId } });
  if (!team) throw new Error('Team not found.');

  const teamMember = await db.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId: teamId,
        userId: userId,
      },
    },
  });

  if (
    !teamMember ||
    (teamMember.role !== 'ADMINISTRATOR' && teamMember.role !== 'OWNER')
  ) {
    throw new Error('You are not authorized to delete this team.');
  }

  const result = await db.$transaction(async (prisma) => {
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
  redirect('/dashboard/drive');
  return result;
};

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
