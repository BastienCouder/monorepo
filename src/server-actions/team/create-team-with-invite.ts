'use server';
import { PrismaClient, UserRole } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

interface CreateTeamAndGenerateInviteParams {
  teamName: string;
  userEmail: string;
  defaultRole: UserRole;
  invitedByUserId: string;
  domain: string;
  slug: string;
}

async function createTeamAndGenerateInvite({
  teamName,
  userEmail,
  defaultRole,
  invitedByUserId,
  domain,
  slug,
}: CreateTeamAndGenerateInviteParams) {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const newTeam = await prisma.team.create({
        data: {
          name: teamName,
          domain,
          slug,
          defaultRole,
        },
      });

      const invitationToken = uuidv4();
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);

      const newInvitation = await prisma.invitation.create({
        data: {
          teamId: newTeam.id,
          email: userEmail,
          role: defaultRole,
          token: invitationToken,
          expires: expirationDate,
          invitedBy: invitedByUserId,
        },
      });

      return { newTeam, newInvitation };
    });

    console.log('Équipe créée avec succès:', result.newTeam);
    console.log('Invitation générée:', result.newInvitation);
  } catch (error) {
    console.error(
      'Erreur lors de la création de l’équipe et de l’invitation:',
      error
    );
  }
}

// createTeamAndGenerateInvite({
//     teamName: 'Example Team',
//     userEmail: 'user@example.com',
//     defaultRole: UserRole.MEMBER, // Assurez-vous que cela correspond à une valeur de l'énumération UserRole
//     invitedByUserId: 'someUserId',
//     domain: 'example.com',
//     slug: 'example-team',
//   });
