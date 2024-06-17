'use client';
import { unstable_noStore as noStore } from 'next/cache';
import { type Table } from '@tanstack/react-table';
import { Folder, File } from '@/models/db';
import { pasteItems } from '@/server/uploads/copy-paste';
import { deleteItems } from '@/server/drive/delete-items-drive';

type Item = Folder | File;

export const copySelectedRows = (
    selectedItems?: string[],
    table?: Table<Item>
) => {
    let folderIds: string[] = [];
    let fileIds: string[] = [];

    if (table) {
        const selectedRows = table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original);
        folderIds = selectedRows
            .filter((item) => 'subfolders' in item)
            .map((folder) => folder.id);
        fileIds = selectedRows
            .filter((item) => !('subfolders' in item))
            .map((file) => file.id);
    }

    if (selectedItems) {
        selectedItems.forEach((id) => {
            folderIds.push(id);
        });
    }

    if (folderIds.length || fileIds.length) {
        const allIds = [...folderIds, ...fileIds];
        console.log('Éléments copiez avec succès.', allIds);

        // const set = setLocalStorage('copiedItems', { allIds });
    } else {
        // toast.error("Aucun élément n'est sélectionné pour la copie.");
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
    table?: Table<Item>,
    clearSelection?: () => void,
    teamId?: string,
    userId?: string
) => {
    let folderIds: string[] = [];
    let fileIds: string[] = [];

    if (table) {
        const selectedRows = table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original);
        folderIds = selectedRows
            .filter((item) => 'subfolders' in item)
            .map((folder) => folder.id);
        fileIds = selectedRows
            .filter((item) => !('subfolders' in item))
            .map((file) => file.id);
    }

    if (selectedItems) {
        selectedItems.forEach((id) => {
            folderIds.push(id);
        });
    }

    if (folderIds.length || fileIds.length) {
        const allIds = [...folderIds, ...fileIds];

        deleteItems(allIds, teamId, userId).then(() => {
            clearSelection!();
            // toast.success(
            //   'Les éléments sélectionnés ont été supprimés avec succès.'
            // );
        });
        //   .catch((err) => {
        //     toast.error(`Erreur lors de la suppression des éléments: ${err}`);
        //   });
    } else {
        // toast.error("Aucun élément n'est sélectionné pour la copie.");
    }
}
