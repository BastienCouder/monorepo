'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useModal } from '@/hooks/use-modal-store';
import Dropzone from '@/app/[locale]/(dashboard)/dashboard/(routes)/drive/(route)/[teamId]/_components/dropzone';

interface DropzoneModalProps {
  children: React.ReactNode;
}

export function DropzoneModal({ children }: DropzoneModalProps) {
  const { isOpen: modalOpen, type } = useModal();
  const [isOpen, setIsOpen] = useState(modalOpen && type === 'get-key');
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-5xl sm:min-h-[400px]">
          <Dropzone folderId={''} teamId={'fb'} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="space-y-4 p-4 pt-0">
        <Dropzone folderId={''} teamId={'fb'} />
      </DrawerContent>
    </Drawer>
  );
}
