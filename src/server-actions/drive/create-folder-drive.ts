import { db } from '@/lib/prisma';

interface CreateFolderInput {
  name: string;
  teamId: string;
  parentId?: string | null; // Optionnel, pour les sous-dossiers
}

export async function createTeamFolder({
  name,
  teamId,
  parentId = null,
}: CreateFolderInput) {
  try {
    const newFolder = await db.folder.create({
      data: {
        name: name,
        teamId: teamId,
        parentId: parentId,
      },
    });

    console.log('Nouveau dossier créé avec succès:', newFolder);
    return newFolder;
  } catch (error) {
    console.error('Erreur lors de la création du dossier:', error);
    throw error;
  }
}
