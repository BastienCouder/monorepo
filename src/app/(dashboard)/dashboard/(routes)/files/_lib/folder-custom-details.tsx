import DocumentsIcon from '@/assets/images/documents';
import DownloadIcon from '@/assets/images/download';
import MusicIcon from '@/assets/images/music';
import OneDriveIcon from '@/assets/images/onedrive';
import OthersIcon from '@/assets/images/other';
import PicturesIcon from '@/assets/images/pictures';
import VideosIcon from '@/assets/images/video';
import { useTheme } from 'next-themes';
import { UseThemeProps } from 'next-themes/dist/types';

export const getFolderDetails = (folderName: string) => {
  const theme: UseThemeProps = useTheme();
  switch (folderName) {
    case 'Documents':
      return { color: '#2146B5', Icon: DocumentsIcon };
    case 'Pictures':
      return { color: '#BC8224', Icon: PicturesIcon };
    case 'Videos':
      return { color: '#9216BB', Icon: VideosIcon };
    case 'Downloads':
      return { color: '#0E9606', Icon: DownloadIcon };
    case 'Musics':
      return { color: '#FA3E31', Icon: MusicIcon };
    case 'OneDrive':
      return { color: '#1E3CB3', Icon: OneDriveIcon };
    case 'Adobe':
      return { color: '#FA3E31', Icon: MusicIcon };
    case 'Phostoshop':
      return { color: '#FA3E31', Icon: MusicIcon };
    case 'Illustrator':
      return { color: '#FA3E31', Icon: MusicIcon };
    case 'Indesign':
      return { color: '#FA3E31', Icon: MusicIcon };
    case 'Visual-studio' || 'Vs-code':
      return { color: '#FA3E31', Icon: MusicIcon };
    case 'Others':
      return {
        color: theme.theme === 'dark' ? '#D6E6E6' : '#555C5C',
        Icon: OthersIcon,
      };
    default:
      return {
        color: theme.theme === 'dark' ? '#D6E6E6' : '#555C5C',
        Icon: OthersIcon,
      };
  }
};
