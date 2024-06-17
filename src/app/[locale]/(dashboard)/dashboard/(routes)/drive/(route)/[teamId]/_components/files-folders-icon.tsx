import { MdFolder } from 'react-icons/md';
import { FC } from 'react';
import { getFileDetails } from '../_lib/custom-files';
import { File, Folder } from '@/models/db';

const FileOrFolderIcon: FC<{ item: Folder | File }> = ({ item }) => {
  if (!item.hasOwnProperty('size')) {
    return <MdFolder size={55} color="hsl(var(--primary))" />;
  } else {
    const { Icon } = getFileDetails(item.mimeType);
    return (
      <div className="w-6 h-6">
        <Icon color="hsl(var(--primary))" />
      </div>
    );
  }
};

export default FileOrFolderIcon;
