import * as React from 'react';
import { unstable_noStore as noStore } from 'next/cache';
import { type Table } from '@tanstack/react-table';
import { toast } from 'sonner';
import { catchError } from '@/lib/catch-error';
import { renameItem } from '@/server-actions/user/rename-item';
import { deleteItems } from '@/server-actions/user/delete-items';
import { Folder, File } from '@/schemas/db';
import { copyItems, moveItems, pasteItems } from '@/server-actions/uploads/copy-paste';


interface CopiedItems {
  folderIds: string[];
  fileIds: string[];
}

let copiedItems: CopiedItems = {
  folderIds: [],
  fileIds: [],
};



type Item = Folder | File;

export function copySelectedRows(selectedItems: string[], table?: Table<Item>) {
  let folderIds: string[] = [];
  let fileIds: string[] = [];

  if (table) {
    const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
    folderIds = selectedRows.filter(item => 'subfolders' in item).map(folder => folder.id);
    fileIds = selectedRows.filter(item => !('subfolders' in item)).map(file => file.id);
  } else {
    folderIds = selectedItems;
  }

  copyItems([...folderIds, ...fileIds]).then(() => {
    toast.success('Éléments copiés avec succès.');
  }).catch(err => {
    toast.error(`Erreur lors de la copie des éléments: ${err}`);
  });
}



export function pasteSelectedRows(userId: string, targetFolderId: string) {
  if (copiedItems.folderIds.length === 0 && copiedItems.fileIds.length === 0) {
    toast.error('Aucun élément à coller.');
    return;
  }
  pasteItems(userId, targetFolderId).then(() => {
    console.log('Éléments collés avec succès.');

    toast.success('Éléments collés avec succès.');
    copiedItems = { folderIds: [], fileIds: [] };
  }).catch(err => {
    toast.error(catchError(err));
  });
}

export const renameSelectedItem = (table: Table<Folder | File>, newName: string, userId: string) => {
  const selectedRow = table.getFilteredSelectedRowModel().rows[0]?.original;
  if (!selectedRow) {
    toast.error("Aucun élément sélectionné pour renommer.");
    return;
  }

  noStore();
  toast.promise(
    renameItem(selectedRow.id, newName, userId),
    {
      loading: 'Renommage en cours...',
      success: 'Élément renommé avec succès.',
      error: (err: unknown) => catchError(err),
    }
  );
};

export const deleteSelectedRows = (table: Table<Folder | File>, userId: string) => {
  const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
  if (selectedRows.length === 0) {
    toast.error("Aucun élément sélectionné pour la suppression.");
    return;
  }

  const itemIds = selectedRows.map(item => item.id);

  deleteItems(itemIds, userId).then(() => {
  }).catch(err => {
    toast.error(catchError(err));
  });
};

export const moveSelectedRows = async (table: Table<Folder | File>, targetFolderId: string) => {
  const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);

  if (selectedRows.length === 0) {
    toast.error("Aucun élément sélectionné pour le déplacement.");
    return;
  }

  // Segregate folder and file IDs
  const folderIds = selectedRows.filter(item => 'subfolders' in item).map(folder => folder.id);
  const fileIds = selectedRows.filter(item => !('subfolders' in item)).map(file => file.id);

  try {
    // Assuming moveItems is a function you will create to handle the actual update of folderId/parentId in the DB
    await moveItems(folderIds, fileIds, targetFolderId);
    toast.success('Éléments déplacés avec succès.');
  } catch (err) {
    toast.error(`Erreur lors du déplacement des éléments: ${catchError(err)}`);
  }
};
