'use client';

import { buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { CreateFolderForm } from './create-folder-form';
import React from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { TbFolderPlus } from 'react-icons/tb';
import { cn } from '@/lib/utils';

interface CreateFolderProps {
  basePath: string | undefined;
}

const CreateFolderModal = ({ basePath }: CreateFolderProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className={`${cn(buttonVariants())}`}>
          <TbFolderPlus className="w-4 h-4 mr-2" /> New folder
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New folder</DialogTitle>
            <div className="pt-4">
              <CreateFolderForm setIsOpen={setIsOpen} basePath={basePath} />
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className={cn(buttonVariants())}>
        <TbFolderPlus className="w-4 h-4 mr-2" />
        New folder
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>New folder</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pb-8">
          <CreateFolderForm setIsOpen={setIsOpen} basePath={basePath} />
        </div>
        {/* <DrawerFooter>
      <Button>Submit</Button>
      <DrawerClose>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
    </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  );
};

export default CreateFolderModal;
