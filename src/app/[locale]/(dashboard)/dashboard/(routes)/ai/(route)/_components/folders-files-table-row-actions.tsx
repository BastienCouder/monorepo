import { Button } from '@/components/ui/button';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
// import { UpdateForm } from './update-form';
import { Row } from '@tanstack/react-table';

import CreateRenameModal from './create-rename-modal';
import { UpdateForm } from '../../../users/_components/update-form';
import { deleteItem } from '@/server/user/delete-item';
import { toast } from 'sonner';
import { catchError } from '@/lib/catch-error';

type WithId = {
  id: string;
};

type FolderFileTableRowActionsProps<TData extends WithId> = {
  row: Row<TData>;
  startTransition: React.TransitionStartFunction;
  setCurrentPath: (path: string) => void;
};

function FolderFileTableRowActions<TData extends WithId>({
  row,
  startTransition,
  setCurrentPath,
}: FolderFileTableRowActionsProps<TData>) {
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="h-full">
          <Button
            aria-label="Open menu"
            variant="default"
            className="flex px-2 my-2 py-1 h-full data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <CreateRenameModal itemId={row.original.id} type="name" />
            </DropdownMenuItem>
          </DialogTrigger>

          <DropdownMenuItem
            onClick={() => console.log('Download file:', row.original.id)}
          >
            Download
          </DropdownMenuItem>

          {row.original.hasOwnProperty('size') ? (
            <DropdownMenuItem onClick={() => setCurrentPath(row.original.id)}>
              Open
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setCurrentPath(row.original.id)}>
              Open
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mettre à jour</DialogTitle>
            <DialogDescription>
              <UpdateForm setIsOpen={setShowEditDialog} row={row} />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
}

export default FolderFileTableRowActions;
