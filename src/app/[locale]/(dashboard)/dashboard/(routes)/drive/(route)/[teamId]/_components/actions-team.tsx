"use client"

import Link from "next/link";
import { SettingsTeam } from "./settings-team";
import { Button } from "@/components/ui/button";
import { Team, User } from "@/models/db";
import { useRouteParam } from "@/providers/route-params-provider";


interface ActionsTeamProps {
    role: string | null
    team: Team,
    user: User
}


export default function ActionsTeam({ role, team, user }: ActionsTeamProps) {
    const { setParam } = useRouteParam();

    const handleBackClick = () => {
        setParam(null);
    };

    return (
        <div className="flex gap-4">
            {/* {userTeam.map((user, index) => (
      <img
        key={index}
        src={user?.image!}
        alt={`Avatar ${index + 1}`}
        className="w-10 h-10 border-2 border-white rounded-full object-cover shadow"
        style={{ zIndex: userTeam.length - index }}
      />
    ))} */}
            {(role === 'ADMINISTRATOR' || role === 'OWNER') && (
                <SettingsTeam team={team} userId={user.id} />
            )}
            <Link onClick={handleBackClick} href={'/dashboard/drive'}>
                <Button>back</Button>
            </Link>
        </div>
    )
}