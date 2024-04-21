'use client';

import { Button } from '@/components/ui/button';
import { useEdgeStore } from '@/lib/edgestore';
import * as React from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { ChoiceCheckbox } from './choice-checkbox';
import { MultiFileDropzone } from './multi-files';

interface InterfaceMultiFileProps {
    folderId: string
}
export default function InterfaceMulfile({ folderId }: InterfaceMultiFileProps) {

    return (

        <section className="mt-4 flex flex-start flex-col items-start w-full space-y-6 lg:pr-4">
            {/* <div className="w-full flex">
                <h1 className="font-bold text-xl first-letter:uppercase">
                    Uploads
                </h1>
            </div>
            <div className='flex gap-4'>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline">Options</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <ChoiceCheckbox />
                        </div>
                    </PopoverContent>
                </Popover>
            </div> */}
            <div className='w-full'>
                <MultiFileDropzone folderId={folderId} />
            </div>
        </section>
    );
}
