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
import React from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { CreateFolderForm } from './create-form-folder-team';

interface CreateFolderProps {
    basePath: string;
    refreshData: () => void;
    teamId: string
}

const CreateFolderModal = ({ basePath, refreshData, teamId }: CreateFolderProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger className={buttonVariants()}>
                    <PlusCircle className="w-4 h-4 mr-1" /> New folder
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New folder</DialogTitle>
                        <DialogDescription className="pt-4">
                            <CreateFolderForm
                                setIsOpen={setIsOpen}
                                basePath={basePath}
                                refreshData={refreshData}
                                teamId={teamId}
                            />
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
                New folder
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>New folder</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 pb-8">
                    <CreateFolderForm
                        setIsOpen={setIsOpen}
                        basePath={basePath}
                        refreshData={refreshData}
                        teamId={teamId}
                    />
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
