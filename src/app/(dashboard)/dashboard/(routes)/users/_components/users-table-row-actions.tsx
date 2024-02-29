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
import { toast } from 'sonner';
import { deleteUser } from '../_lib/actions';
import { catchError } from '@/lib/catch-error';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UpdateForm } from './update-form';
import { Row } from '@tanstack/react-table';

type WithId = {
  id: string;
};

type UserTableRowActionsProps<TData extends WithId> = {
  row: Row<TData>;
  startTransition: React.TransitionStartFunction;
};

function UserTableRowActions<TData extends WithId>({
  row,
  startTransition,
}: UserTableRowActionsProps<TData>) {
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open menu"
          variant="ghost"
          className="flex size-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DialogTrigger asChild>
            <DropdownMenuItem>Modifier</DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              startTransition(() => {
                row.toggleSelected(false);

                toast.promise(
                  deleteUser({
                    id: row.original.id,
                  }),
                  {
                    loading: 'EN cours de suppression...',
                    success: () => "L'utilisateur a été supprimé avec succès.",
                    error: (err: unknown) => catchError(err),
                  }
                );
              });
            }}
          >
            Supprimer
          </DropdownMenuItem>
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

export default UserTableRowActions;
