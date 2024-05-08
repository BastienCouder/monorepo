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

interface CreateFolderProps {
  itemId: string;
  type: string;
}

const CreateRenameModal = ({ itemId, type }: CreateFolderProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className={`p-0`}>
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
      <DrawerTrigger className={`p-0`}>
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
