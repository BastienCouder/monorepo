'use client';
import {
  FiFolder,
  FiImage,
  FiVideo,
  FiDownload,
  FiFileText,
} from 'react-icons/fi';

export interface Directory {
  name: string;
  usedSpace: number; // Espace utilisé en Go
  filesCount: number; // Nombre de fichiers dans le dossier
  Icon: React.ElementType; // Type pour les icônes de react-icons
}

export const fakeData: Directory[] = [
  { name: 'Documents', usedSpace: 5, filesCount: 120, Icon: FiFileText },
  { name: 'Pictures', usedSpace: 7, filesCount: 300, Icon: FiImage },
  { name: 'Videos', usedSpace: 3, filesCount: 45, Icon: FiVideo },
  { name: 'Downloads', usedSpace: 2, filesCount: 150, Icon: FiDownload },
  // Vous pouvez ajouter d'autres dossiers ici
];
