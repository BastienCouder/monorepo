'use client';

import { Button } from '@/components/ui/button';
import { useEdgeStore } from '@/lib/edgestore';
import * as React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { ChoiceCheckbox } from './choice-checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Dropzone from './dropzone';
import UserStorageInfo from './user-progress-info';
import { User } from '@/models/db';
import { Icons } from '@/components/shared/icons';

interface InterfaceMultiDropzoneProps {
  folderId: string;
  user: User;
}
export default function InterfaceMultiDropzone({
  folderId,
  user,
}: InterfaceMultiDropzoneProps) {
  return (
    <section className="mt-4 flex flex-start flex-col items-start w-full space-y-2">
      {/* <div className="w-full flex">
                <h1 className="font-bold text-xl first-letter:uppercase">
                    Ai
                </h1>
            </div> */}
      <div className="w-full flex space-x-12">
        <Tabs defaultValue="Dragdrop" className="w-3/5">
          <div className="flex gap-2 items-center">
            <TabsList>
              <TabsTrigger value="Dragdrop">
                Uploads folders and files
              </TabsTrigger>
            </TabsList>
            <UserStorageInfo user={user} />
          </div>

          <TabsContent value="Dragdrop">
            <Dropzone folderId={folderId} />
          </TabsContent>
        </Tabs>
        <div className="w-2/5 flex gap-4 flex-col mt-12">
          <div className="flex gap-4">
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
            <Button>Sort</Button>
          </div>
          <p className="text-xs">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet
            suscipit, quae hic quidem pariatur rerum
          </p>
        </div>
      </div>
    </section>
  );
}
