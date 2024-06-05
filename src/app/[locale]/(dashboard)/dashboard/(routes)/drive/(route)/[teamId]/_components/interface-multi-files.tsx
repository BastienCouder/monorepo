'use client';

import * as React from 'react';
import Dropzone from './dropzone';

interface InterfaceMultiFileProps {
  folderId: string;
  teamId: string;
}
export default function InterfaceMulfile({
  folderId,
  teamId,
}: InterfaceMultiFileProps) {
  return (
    <section className="mt-4 flex flex-start flex-col items-start w-full space-y-6 ">
      <div className="w-full">
        <Dropzone folderId={folderId} teamId={teamId} />
      </div>
    </section>
  );
}
