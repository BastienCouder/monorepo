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
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { CreateCategoryForm } from './create-category';
import { CreateCourseForm } from './create-course';

interface CreateModalProps {
  type: string;
}
const CreateModal = ({ type }: CreateModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className={buttonVariants()}>
          <PlusCircle className="w-4 h-4 mr-1" />{' '}
          {type === 'category' && 'Nouvelle catégorie'}
          {type === 'course' && 'Nouveau cours'}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {type === 'category' && 'Nouvelle catégorie'}
              {type === 'course' && 'Nouveau cours'}
            </DialogTitle>
            <DialogDescription className="pt-4">
              {type === 'category' && (
                <CreateCategoryForm setIsOpen={setIsOpen} />
              )}
              {type === 'course' && <CreateCourseForm setIsOpen={setIsOpen} />}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className={buttonVariants()}>
        <PlusCircle className="w-4 h-4 mr-1" />
        {type === 'category' && 'Nouvelle catégorie'}
        {type === 'course' && 'Nouveau cours'}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {type === 'category' && 'Nouvelle catégorie'}
            {type === 'course' && 'Nouveau cours'}
          </DrawerTitle>
          {/* <DrawerDescription>This action cannot be undone.</DrawerDescription> */}
        </DrawerHeader>
        <div className="p-4 pb-8">
          {type === 'category' && <CreateCategoryForm setIsOpen={setIsOpen} />}
          {type === 'course' && <CreateCourseForm setIsOpen={setIsOpen} />}
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

export default CreateModal;
