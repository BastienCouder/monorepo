"use client";

import { Button, Card, Popover, PopoverContent, PopoverTrigger, buttonVariants } from '@/components/ui';
import { cn } from '@/lib/utils';
import { ChevronDown, ClipboardCopyIcon, ClipboardIcon, TrashIcon } from 'lucide-react';
import React from 'react'
import type { Table } from '@tanstack/react-table';
import { IoReturnDownBackOutline } from 'react-icons/io5';
import Tree from '@/app/[locale]/(dashboard)/dashboard/(routes)/drive/(route)/[teamId]/_components/tree';
import { DropzoneModal } from '@/components/modal/dropzone-modal';
import { Icons } from '@/components/shared/icons';
import { CreateFolder } from './create-folder';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useModal } from '@/hooks/use-modal-store';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useSelection } from '@/providers/select-item-provider';
import Link from 'next/link';
import { PlusCircledIcon } from '@radix-ui/react-icons';

interface DataTableSecondToolbarProps<TData> {
    table: Table<TData>;
    goBack?: () => void;
    basePath?: string;
    newRowLink?: string;
    deleteRowsAction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    copyRowsAction?: () => void;
    pasteRowsAction?: () => void;
    teamId?: string;
}

export function DataTableSecondToolbar<TData>({
    table,
    deleteRowsAction,
    copyRowsAction,
    pasteRowsAction,
    goBack,
    newRowLink,
    teamId,
    basePath
}: DataTableSecondToolbarProps<TData>) {
    const [isPending, startTransition] = React.useTransition();
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const { selectedItems } = useSelection();
    const { onOpen } = useModal();
    const user = useCurrentUser();
    const hasTableSelectedItems = table.getSelectedRowModel().rows.length > 0;
    const hasContextSelectedItems = selectedItems.length > 0;
    const disableActions = !hasTableSelectedItems && !hasContextSelectedItems;


    const handleDropzone = () => {
        onOpen('dropzone');
    };

    const handleCreateFolder = (
        userId: string | undefined,
        teamId: string | undefined,
        basePath: string | undefined
    ) => {
        onOpen('create-folder-team', { userId, teamId, parentFolderId: basePath });
    };

    return (
        <>
            <Card
                className={`flex p-2 w-full flex-col md:flex-row rounded-sm border-none md:items-center shadow-none md:justify-between md:space-x-12 space-y-4 md:space-y-0 custom-scrollbar`}
            >
                <div
                    className={`flex items-center space-x-2 custom-scrollbar`}
                >

                    <Popover>
                        <PopoverTrigger
                            className={`px-2 py-0 gap-2 ${cn(buttonVariants({ variant: 'none', size: 'sm' }))}`}
                        >
                            Tag
                        </PopoverTrigger>
                        <PopoverContent className="w-[350px]">

                        </PopoverContent>
                    </Popover>
                </div>


                <div
                    className={` ${isDesktop ? '' : 'overflow-x-auto'} flex items-center space-x-2 custom-scrollbar`}
                >
                    <DropzoneModal>
                        <Button
                            aria-label="Uploads"
                            variant="default"
                            size={'sm'}
                            className="gap-2"
                            onClick={() => handleDropzone()}
                        >
                            <Icons.uploads className="size-4" aria-hidden="true" /> Uploads
                        </Button>
                    </DropzoneModal>
                    {teamId && (
                        <>
                            {isDesktop ? (
                                <Popover>
                                    <PopoverTrigger
                                        className={`px-2 py-0 gap-2 ${cn(buttonVariants({ variant: 'default', size: 'sm' }))}`}
                                    >
                                        {' '}
                                        <Icons.plus size={17} /> Create Folder
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[350px]">
                                        <CreateFolder
                                            isDesktop={isDesktop}
                                            userId={user?.id}
                                            teamId={teamId}
                                            parentFolderId={basePath}
                                        />
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <CreateFolder
                                    isDesktop={isDesktop}
                                    userId={user?.id}
                                    teamId={teamId}
                                    parentFolderId={basePath}
                                >
                                    <Button
                                        aria-label="Create Folder"
                                        variant="default"
                                        size={'sm'}
                                        className="gap-2"
                                        onClick={() =>
                                            handleCreateFolder(user?.id, teamId, basePath)
                                        }
                                    >

                                        <Icons.plus className="size-4" aria-hidden="true" /> Create
                                        Folder
                                    </Button>
                                </CreateFolder>
                            )}
                        </>
                    )}
                    {copyRowsAction && (
                        <Button
                            aria-label="Copier les lignes sélectionnées"
                            variant="outline"
                            size="sm"
                            className="h-8 transition-all"
                            onClick={copyRowsAction}
                            disabled={isPending || disableActions}
                        >
                            <ClipboardCopyIcon className="mr-2 size-4" aria-hidden="true" />
                            Copier
                        </Button>
                    )}

                    {pasteRowsAction && (
                        <Button
                            aria-label="Coller les éléments"
                            variant="outline"
                            size="sm"
                            className="h-8 transition-all"
                            onClick={pasteRowsAction}
                            disabled={isPending}
                        >
                            <ClipboardIcon className="mr-2 size-4" aria-hidden="true" />
                            Coller
                        </Button>
                    )}
                    {/* Bouton de suppression et création de nouvelle ligne existant */}
                    {deleteRowsAction ? (
                        <Button
                            aria-label="Supprimer les lignes sélectionnées"
                            variant="outline"
                            size="sm"
                            className="h-8 transition-all"
                            onClick={(event) => {
                                startTransition(() => {
                                    table.toggleAllPageRowsSelected(false);
                                    deleteRowsAction(event);
                                });
                            }}
                            disabled={isPending || disableActions}
                        >
                            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
                            Delete
                        </Button>
                    ) : newRowLink ? (
                        <Link aria-label="Créer une nouvelle ligne" href={newRowLink}>
                            <div
                                className={cn(
                                    buttonVariants({
                                        variant: 'outline',
                                        size: 'sm',
                                        className: 'h-8 transition-all',
                                    })
                                )}
                            >
                                <PlusCircledIcon className="mr-2 size-4" aria-hidden="true" />
                                Nouveau
                            </div>
                        </Link>
                    ) : null}

                    {/* <DataTableViewOptions table={table} /> */}

                    {goBack && (
                        <Button
                            aria-label="Coller les éléments"
                            variant="secondary"
                            size="sm"
                            className="h-8 transition-all"
                            onClick={goBack}
                            disabled={basePath === ''}
                        >
                            Back
                        </Button>
                    )}

                </div>
            </Card>
        </>
    )
}

export default DataTableSecondToolbar