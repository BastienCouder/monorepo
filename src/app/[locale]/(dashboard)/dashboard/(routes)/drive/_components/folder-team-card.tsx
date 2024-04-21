'use client';
import { formatDate } from '@/lib/utils';
import { Team, TeamMember } from '@/schemas/db';
import Link from 'next/link';
import React from 'react';
import { AiFillFolder } from 'react-icons/ai';

interface FolderTeamCardProps {
  team: Team;
  index: number;
}

export default function FolderTeamCard({ team, index }: FolderTeamCardProps) {
  return (
    <li
      key={index}
      className="bg-background drop-shadow-sm  w-full sm:w-1/2 lg:w-1/4 p-4 rounded-md"
    >
      <Link href={`/dashboard/drive/${team.slug}`}>
        <div className="space-y-2">
          <AiFillFolder size={55} className="text-primary -ml-1" />
          <h2 className="text-xl font-bold first-letter:uppercase">
            {team.name}
          </h2>
          <p>{formatDate(String(team.updatedAt))}</p>
          {team.members.map((member: TeamMember) => (
            <p>{member.name}</p>
          ))}
        </div>
      </Link>
    </li>
  );
}
