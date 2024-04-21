'use client';

import * as React from 'react';
import { MultiFileDropzone } from './multi-files';

interface InterfaceMultiFileProps {
    folderId: string,
    teamId: string
}
export default function InterfaceMulfile({ folderId, teamId }: InterfaceMultiFileProps) {

    return (

        <section className="mt-4 flex flex-start flex-col items-start w-full space-y-6 lg:pr-4">
            <div className='w-full'>
                <MultiFileDropzone folderId={folderId} teamId={teamId} />
            </div>
        </section>
    );
}
