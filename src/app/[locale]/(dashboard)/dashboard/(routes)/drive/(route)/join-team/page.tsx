'use client';
import verificationAccess from '@/server/team/verification-access';
import { useSearchParams } from 'next/navigation';
import React from 'react';

export default function JoinTeam() {
  const searchParams = useSearchParams();

  const teamSlug = searchParams.get('teamSlug');
  const key = searchParams.get('key');

  const [accessGranted, setAccessGranted] = React.useState(false);

  React.useEffect(() => {
    const verifyAccess = async () => {
      if (teamSlug && key) {
        try {
          await verificationAccess(teamSlug, key);
          setAccessGranted(true);
        } catch (error) {
          console.error('Erreur lors de la vérification de l’accès', error);
        }
      }
    };

    verifyAccess();
  }, [teamSlug, key]);

  return (
    <div>
      {accessGranted ? (
        <p>Accès autorisé. Bienvenue dans l'équipe {teamSlug} !</p>
      ) : (
        <p>Validation de l'accès...</p>
      )}
    </div>
  );
}
