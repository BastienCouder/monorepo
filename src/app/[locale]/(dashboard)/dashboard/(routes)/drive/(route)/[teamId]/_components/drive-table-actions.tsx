'use client';
import { unstable_noStore as noStore } from 'next/cache';
import { type Table } from '@tanstack/react-table';
import { Folder, File } from '@/models/db';
import { pasteItems } from '@/server/uploads/copy-paste';
import { deleteItems } from '@/server/drive/delete-items-drive';
import { toast } from 'sonner';

export const copySelectedRows = (
    clearSelection: () => void,
    selectedItems?: string[],
) => {
    let ids: string[] = [];

    if (selectedItems) {
        selectedItems.forEach((id) => {
            ids.push(id);
        });

        const allIds = [...ids];
        // deleteItems(allIds, teamId, userId).then(() => {
        clearSelection();
        toast('Éléments sélectionnés copiés avec succès.');
        // })
        // .catch((err) => {
        //     toast(`Erreur lors de la suppression des éléments: ${err}`);
        // });
    } else {
        toast("Aucun fichier selectionnées.");

    }
}

export const pasteSelectedRows = (targetFolderId: string) => {
    let data: any = [];
    // data = getLocalStorage('copiedItems', { allIds: [] });
    if (data.length === 0) {
        // toast.error('Aucun élément à coller.');
        return;
    }
    console.log(targetFolderId);

    pasteItems(targetFolderId, data.allIds)
        .then(() => {
            console.log('Éléments collés avec succès.', data);
            // toast.success('Éléments collés avec succès.');
        })
        .catch((err) => {
            // toast.error(
            //     `Erreur lors de la collage des éléments: ${err.message || err.toString()}`
            // );
        });
}

export const renameSelectedItem = (
    table: Table<Folder | File>,
    newName: string,
    userId: string
) => {
    const selectedRow = table.getFilteredSelectedRowModel().rows[0]?.original;
    if (!selectedRow) {
        // toast.error('Aucun élément sélectionné pour renommer.');
        return;
    }

    noStore();
    //   toast.promise(renameItem(selectedRow.id, newName, userId), {
    //     loading: 'Renommage en cours...',
    //     success: 'Élément renommé avec succès.',
    //     error: (err: unknown) => catchError(err),
    //   });
};

export const deleteSelectedRows = (
    selectedItems?: string[],
    clearSelection?: () => void,
    teamId?: string,
    userId?: string
) => {
    let ids: string[] = [];

    if (selectedItems) {
        selectedItems.forEach((id) => {
            ids.push(id);
        });
    }

    if (ids.length !== 0 && clearSelection) {
        const allIds = [...ids];

        deleteItems(allIds, teamId, userId).then(() => {
            clearSelection();
            toast('Éléments sélectionnés supprimés avec succès.');
        })
            .catch((err) => {
                toast(`Erreur lors de la suppression des éléments: ${err}`);
            });
    } else {
        toast("Aucun fichier selectionnées.");
    }
}
