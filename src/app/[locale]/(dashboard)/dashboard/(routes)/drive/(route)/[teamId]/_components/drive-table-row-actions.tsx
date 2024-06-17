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
import { Row } from '@tanstack/react-table';

type WithIdName = {
  id: string;
  name: string;
};

type FolderFileTableRowActionsProps<TData extends WithIdName> = {
  row: Row<TData>;
  startTransition: React.TransitionStartFunction;
  setCurrentPath: (path: { id: string; name: string }) => void;
};

function FolderFileTableRowActions<TData extends WithIdName>({
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
            variant="ghost"
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
              {/* <l itemId={row.original.id} /> */}
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              startTransition(() => {
                row.toggleSelected(false);
                // toast.promise(deleteItem(row.original.id), {
                //   loading: 'EN cours de suppression...',
                //   success: () => "L'utilisateur a été supprimé avec succès.",
                //   error: (err: unknown) => catchError(err),
                // });
              });
            }}
          >
            Supprimer
          </DropdownMenuItem>
          {row.original.hasOwnProperty('size') ? (
            <DropdownMenuItem
              onClick={() => console.log('Download file:', row.original.id)}
            >
              Download{' '}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() =>
                setCurrentPath({ id: row.original.id, name: row.original.name })
              }
            >
              Open{' '}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mettre à jour</DialogTitle>
            <DialogDescription>
              {/* <CreateRenameModal setIsOpen={setShowEditDialog} row={row} /> */}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
}

export default FolderFileTableRowActions;
