// 'use client';
// import { unstable_noStore as noStore } from 'next/cache';
// import { type Table } from '@tanstack/react-table';
// import { toast } from 'sonner';
// import { catchError } from '@/lib/catch-error';
// import { renameItem } from '@/server-actions/user/rename-item';
// import { Folder, File } from '@/schemas/db';
// import { moveItems, pasteItems } from '@/server-actions/uploads/copy-paste';
// import { deleteItems } from '@/server-actions/user/delete-items';
// import { getLocalStorage, setLocalStorage } from '@/lib/helpers/storageHelper';
// import { operateItems } from '@/server-actions/user/operate-items';

// type Item = Folder | File;

// export function copySelectedRows(
//   selectedItems?: string[],
//   table?: Table<Item>
// ) {
//   let folderIds: string[] = [];
//   let fileIds: string[] = [];

//   if (table) {
//     const selectedRows = table
//       .getFilteredSelectedRowModel()
//       .rows.map((row) => row.original);
//     folderIds = selectedRows
//       .filter((item) => 'subfolders' in item)
//       .map((folder) => folder.id);
//     fileIds = selectedRows
//       .filter((item) => !('subfolders' in item))
//       .map((file) => file.id);
//   }

//   if (selectedItems) {
//     selectedItems.forEach((id) => {
//       folderIds.push(id);
//     });
//   }

//   if (folderIds.length || fileIds.length) {
//     const allIds = [...folderIds, ...fileIds];
//     console.log('Éléments copiez avec succès.', allIds);

//     const set = setLocalStorage('copiedItems', { allIds });
//     console.log(set);
//   } else {
//     toast.error("Aucun élément n'est sélectionné pour la copie.");
//   }
// }

// export function pasteSelectedRows(targetFolderId: string) {
//   let data = [];
//   data = getLocalStorage('copiedItems', { allIds: [] });
//   if (data.length === 0) {
//     toast.error('Aucun élément à coller.');
//     return;
//   }
//   console.log(targetFolderId);

//   pasteItems(targetFolderId, data.allIds)
//     .then(() => {
//       console.log('Éléments collés avec succès.', data);
//       toast.success('Éléments collés avec succès.');
//     })
//     .catch((err) => {
//       toast.error(
//         `Erreur lors de la collage des éléments: ${err.message || err.toString()}`
//       );
//     });
// }

// export const renameSelectedItem = (
//   table: Table<Folder | File>,
//   newName: string,
//   userId: string
// ) => {
//   const selectedRow = table.getFilteredSelectedRowModel().rows[0]?.original;
//   if (!selectedRow) {
//     toast.error('Aucun élément sélectionné pour renommer.');
//     return;
//   }

//   noStore();
//   toast.promise(renameItem(selectedRow.id, newName, userId), {
//     loading: 'Renommage en cours...',
//     success: 'Élément renommé avec succès.',
//     error: (err: unknown) => catchError(err),
//   });
// };

// export function deleteSelectedRows(
//   selectedItems?: string[],
//   table?: Table<Item>,
//   clearSelection?: () => void
// ) {
//   let folderIds: string[] = [];
//   let fileIds: string[] = [];

//   if (table) {
//     const selectedRows = table
//       .getFilteredSelectedRowModel()
//       .rows.map((row) => row.original);
//     folderIds = selectedRows
//       .filter((item) => 'subfolders' in item)
//       .map((folder) => folder.id);
//     fileIds = selectedRows
//       .filter((item) => !('subfolders' in item))
//       .map((file) => file.id);
//   }

//   if (selectedItems) {
//     selectedItems.forEach((id) => {
//       folderIds.push(id);
//     });
//   }

//   if (folderIds.length || fileIds.length) {
//     const allIds = [...folderIds, ...fileIds];

//     deleteItems(allIds)
//       .then(() => {
//         clearSelection!();
//         toast.success(
//           'Les éléments sélectionnés ont été supprimés avec succès.'
//         );
//       })
//       .catch((err) => {
//         toast.error(`Erreur lors de la suppression des éléments: ${err}`);
//       });
//   } else {
//     toast.error("Aucun élément n'est sélectionné pour la copie.");
//   }
// }

// export function operateSelectedRows(
//   selectedItems?: string[],
//   table?: Table<Item>
// ) {
//   let folderIds: string[] = [];
//   let fileIds: string[] = [];

//   if (table) {
//     const selectedRows = table
//       .getFilteredSelectedRowModel()
//       .rows.map((row) => row.original);
//     folderIds = selectedRows
//       .filter((item) => 'subfolders' in item)
//       .map((folder) => folder.id);
//     fileIds = selectedRows
//       .filter((item) => !('subfolders' in item))
//       .map((file) => file.id);
//   }

//   if (selectedItems) {
//     selectedItems.forEach((id) => {
//       folderIds.push(id);
//     });
//   }

//   if (folderIds.length || fileIds.length) {
//     const allIds = [...folderIds, ...fileIds];

//     operateItems(allIds)
//       .then(() => {
//         toast.success(
//           'Les éléments sélectionnés ont été supprimés avec succès.'
//         );
//       })
//       .catch((err) => {
//         toast.error(`Erreur lors de la suppression des éléments: ${err}`);
//       });
//   } else {
//     toast.error("Aucun élément n'est sélectionné pour la copie.");
//   }
// }

// export const moveSelectedRows = async (
//   table: Table<Folder | File>,
//   targetFolderId: string
// ) => {
//   const selectedRows = table
//     .getFilteredSelectedRowModel()
//     .rows.map((row) => row.original);

//   if (selectedRows.length === 0) {
//     toast.error('Aucun élément sélectionné pour le déplacement.');
//     return;
//   }

//   // Segregate folder and file IDs
//   const folderIds = selectedRows
//     .filter((item) => 'subfolders' in item)
//     .map((folder) => folder.id);
//   const fileIds = selectedRows
//     .filter((item) => !('subfolders' in item))
//     .map((file) => file.id);

//   try {
//     // Assuming moveItems is a function you will create to handle the actual update of folderId/parentId in the DB
//     await moveItems(folderIds, fileIds, targetFolderId);
//     toast.success('Éléments déplacés avec succès.');
//   } catch (err) {
//     toast.error(`Erreur lors du déplacement des éléments: ${catchError(err)}`);
//   }
// };
