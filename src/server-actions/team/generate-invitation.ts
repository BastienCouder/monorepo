'use sever';
import { db } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

interface GenerateInvitationInput {
  teamId: string;
  invitedByEmail: string;
  invitedUserEmail: string;
  role: UserRole;
}

async function generateTeamInvitation({
  teamId,
  invitedByEmail,
  invitedUserEmail,
  role,
}: GenerateInvitationInput): Promise<void> {
  try {
    const invitedByUser = await db.user.findUnique({
      where: { email: invitedByEmail },
    });

    if (!invitedByUser) {
      throw new Error('Utilisateur invitant non trouvé.');
    }

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    const invitationToken = uuidv4();

    const newInvitation = await db.invitation.create({
      data: {
        teamId: teamId,
        email: invitedUserEmail,
        role: role,
        token: invitationToken,
        expires: expirationDate,
        invitedBy: invitedByUser.id,
        sentViaEmail: true,
      },
    });

    console.log('Invitation créée avec succès:', newInvitation);
  } catch (error: any) {
    console.error(
      "Erreur lors de la génération de l'invitation:",
      error.message
    );
    // Gérer d'autres actions en cas d'erreur, comme le logging ou le renvoi d'une réponse d'erreur
  }
}

// Exemple d'utilisation
// generateTeamInvitation({
//   teamId: 'teamId_123',
//   invitedByEmail: 'admin@example.com',
//   invitedUserEmail: 'newmember@example.com',
//   role: UserRole.MEMBER, // Utiliser la valeur UserRole en fonction de votre définition Prisma
// });
