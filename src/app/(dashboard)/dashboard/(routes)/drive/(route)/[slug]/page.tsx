import { db } from '@/lib/prisma';
import React from 'react';
import ActionsFolderFilesTeam from './_component/action-folder-files-team';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Team({ params }: { params: { slug: string } }) {
    const team = await db.team.findUnique({
        where: {
            slug: params.slug,
        },
    });

    if (!team) {
        return
    }

    return (
        <>
            <section className="w-full space-y-6 lg:pr-4">
                <div className='w-full flex justify-between'>
                    <h1 className="font-bold text-xl first-letter:uppercase">{team?.name}</h1>
                    <Link href={'/dashboard/drive'}>
                        <Button>Back</Button>
                    </Link>
                </div>
                <ActionsFolderFilesTeam team={team} />
            </section>

        </>
    );
}
