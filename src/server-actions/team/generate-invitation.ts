'use server';
import { sendTeamInvitationEmail } from '@/lib/email';
import { db } from '@/lib/prisma';
import { Team } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export async function generateTeamInvitation(
  team: Team,
  invitedByEmail: string,
  invitedUserEmails: string[]
): Promise<void> {
  try {
    const invitedByUser = await db.user.findUnique({
      where: { email: invitedByEmail },
    });

    if (!invitedByUser) {
      throw new Error('Utilisateur invitant non trouvé.');
    }

    for (const userEmail of invitedUserEmails) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);
      const invitationToken = uuidv4();

      const newInvitation = await db.invitation.create({
        data: {
          teamId: team.id,
          email: userEmail,
          token: invitationToken,
          expires: expirationDate,
          invitedBy: invitedByUser.id,
          sentViaEmail: true,
        },
      });
      await sendTeamInvitationEmail(userEmail, team.slug, team.key);

      console.log('Invitation créée avec succès:', newInvitation);
    }
  } catch (error: any) {
    console.error(
      "Erreur lors de la génération de l'invitation:",
      error.message
    );
  }
}
