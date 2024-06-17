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
import React from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { CreateRenameForm } from './create-rename-form';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateFolderProps {
  itemId: string;
  type: string;
  selectedIndexes: number[];
  i: number;
}

const CreateRenameModal = ({
  itemId,
  type,
  selectedIndexes,
  i,
}: CreateFolderProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
          className={cn(
            `${buttonVariants({ variant: 'secondary' })} 
  ${selectedIndexes.includes(i) ? 'bg-primary text-background  hover:bg-primary/80 hover:text-background/80' : ''} cursor-pointer px-2 py-1 h-auto flex gap-2  text-xs`
          )}
        >
          {type === 'name' && 'Rename'}
          {type === 'icon' && <Pencil size={14} />}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename</DialogTitle>
            <DialogDescription className="pt-4">
              <CreateRenameForm setIsOpen={setIsOpen} itemId={itemId} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger
        className={cn(
          `${buttonVariants({ variant: 'secondary' })} 
  ${selectedIndexes.includes(i) ? 'bg-primary text-background  hover:bg-primary/80 hover:text-background/80' : ''} cursor-pointer px-2 py-1 h-auto flex gap-2  text-xs`
        )}
      >
        {type === 'name' && 'Rename'}
        {type === 'icon' && <Pencil size={14} />}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Rename</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pb-8">
          <CreateRenameForm setIsOpen={setIsOpen} itemId={itemId} />
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

export default CreateRenameModal;
