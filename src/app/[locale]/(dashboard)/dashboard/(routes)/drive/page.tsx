import { currentUser } from '@/lib/auth';
import React from 'react';
import { Team } from '@/models/db';
import { getUserTeams } from '@/server/user/get-user-team';
import FolderTeamCard from './_components/folder-team-card';
import { Separator } from '@/components/ui/separator';
import RecentFiles from './_components/recent-folder-team';

export default async function drive() {
  const user = await currentUser();
  if (!user) {
    return;
  }

  const teams: Team[] = await getUserTeams(user.id);

  return (
    <section className="w-full flex gap-4">
      <div className="w-full space-y-4">
        <h1 className="font-bold text-2xl">My groups</h1>
        <ul className="flex justify-start gap-4 w-full flex-wrap grid grid-cols-3">
          {teams.length > 0 ? (
            teams.map((team, index) => (
              <FolderTeamCard key={index} team={team} index={index} />
            ))
          ) : (
            <div className="flex flex-col gap-4">
              <p className="first-letter:uppercase">no teams.</p>
            </div>
          )}
        </ul>
        <Separator className="bg-primary h-[2px]" />
        <RecentFiles />
      </div>
      <div className="min-w-[300px] min-h-[400px] bg-card shadow-md p-4 rounded-sm">
        aside
      </div>
    </section>
  );
}
