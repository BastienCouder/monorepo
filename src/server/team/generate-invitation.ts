'use server';

import { sendTeamInvitationEmail } from '@/lib/email';
import { db } from '@/lib/prisma';
import { Team } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

interface GenerateTeamInvitationResponse {
  successes: string[];
  errors: string[];
}

export async function generateTeamInvitation(
  team: Team,
  invitedByEmail: string,
  invitedUserEmails: string[]
): Promise<GenerateTeamInvitationResponse> {
  const response: GenerateTeamInvitationResponse = {
    successes: [],
    errors: [],
  };

  try {
    const checkTeam = await db.team.findUnique({
      where: { id: team.id },
    });

    if (!checkTeam) {
      response.errors.push('Team not found.');
      return response;
    }

    const invitedByUser = await db.user.findUnique({
      where: { email: invitedByEmail },
    });

    if (!invitedByUser) {
      response.errors.push('Inviting user not found.');
      return response;
    }

    for (const userEmail of invitedUserEmails) {
      try {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);
        const invitationToken = uuidv4();

        await db.invitation.create({
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
        response.successes.push(
          `Invitation sent to ${userEmail} successfully.`
        );
      } catch (err: any) {
        response.errors.push(
          `Failed to send invitation to ${userEmail}: ${err.message}`
        );
      }
    }
  } catch (error: any) {
    response.errors.push(
      `Error during invitation generation: ${error.message}`
    );
  }

  return response;
}
