'use client';
import { formatDate } from '@/lib/utils';
import { Team, TeamMember } from '@/models/db';
import Link from 'next/link';
import React from 'react';
import { AiFillFolder } from 'react-icons/ai';

interface FolderTeamCardProps {
  team: Team;
  index: number;
}

export default function FolderTeamCard({ team, index }: FolderTeamCardProps) {
  return (
    <Link href={`/dashboard/drive/${team.id}`}>
      <li
        key={index}
        className="bg-card drop-shadow-sm  w-full p-4 rounded-md"
      >
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
      </li>
    </Link>
  );
}
