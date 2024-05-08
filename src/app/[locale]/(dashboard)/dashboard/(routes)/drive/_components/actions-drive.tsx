'use client';

import React from 'react';
import CreateModal from '@/components/modal/create-modal';
import { CreateTeamForm } from './create-team-form';
import { CreateJoinTeamForm } from './join-team-form';
import FolderTeamCard from './folder-team-card';
import { SearchInput } from '@/components/search-input';
import { Team } from '@/schemas/db';
import { Separator } from '@/components/ui/separator';
import { BillingInfo } from '@/app/[locale]/(app)/(marketing)/pricing/_components/billing-info';

interface ActionsDrive {
  teams: Team[];
}

export default function ActionsDrive({ teams = [] }: ActionsDrive) {
  return (
    <section className="w-full space-y-6">
      <h1 className="font-bold text-2xl">My teams</h1>
      <div className="flex justify-between">
        <div className="flex gap-4">
          <CreateModal
            title="Create team"
            dialogTitle="Create Team"
            Component={CreateTeamForm}
            variant={'default'}
          />
          <CreateModal
            title="Join team"
            dialogTitle="Join Team"
            Component={CreateJoinTeamForm}
            variant={'outline'}
          />
        </div>
      </div>
      <ul className="flex justify-start gap-4 w-full flex-wrap sm:flex-nowrap">
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
      <BillingInfo />
    </section>
  );
}
