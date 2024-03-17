'use client';
import React, { ComponentType, useState } from 'react';
import { buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { PlusCircle } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { DialogTriggerProps } from '@radix-ui/react-alert-dialog';
import { cn } from '@/lib/utils';

interface CustomDialogTriggerProps extends DialogTriggerProps {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

const CustomDialogTrigger: React.FC<CustomDialogTriggerProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <DialogTrigger className={className} {...props}>
      {children}
    </DialogTrigger>
  );
};

interface CreateModalProps {
  title: string;
  Component: React.ComponentType<{
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }>;
  variant:
    | 'link'
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'success'
    | null
    | undefined;
}

const CreateModal: React.FC<CreateModalProps> = ({
  variant,
  title,
  Component,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const resolvedVariant = variant ?? 'default';

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <CustomDialogTrigger
          className={buttonVariants({ variant: resolvedVariant })}
        >
          {title}
        </CustomDialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="pt-4">
              {<Component setIsOpen={setIsOpen} />}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className={buttonVariants({ variant: resolvedVariant })}>
        <PlusCircle className="w-4 h-4 mr-1" />
        {title}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle> {title}</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 pb-8">{<Component setIsOpen={setIsOpen} />}</div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateModal;
