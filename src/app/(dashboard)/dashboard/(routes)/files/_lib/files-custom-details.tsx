import React, { FC } from 'react';
import { useTheme } from 'next-themes';


import VideoIcon from '@/assets/images/video';
import MusicIcon from '@/assets/images/music';
import OtherIcon from '@/assets/images/other';
import PicturesIcon from '@/assets/images/pictures';
import DocumentsIcon from '@/assets/images/documents';

interface FileTypeMappingProps {
    color: string;
    Icon: FC<any>;
}

const fileTypeMappings: { [key: string]: FileTypeMappingProps } = {
    'image/png': { color: '#BC8224', Icon: PicturesIcon },
    'image/jpeg': { color: '#BC8224', Icon: PicturesIcon },
    'video/mp4': { color: '#9216BB', Icon: VideoIcon },
    'audio/mpeg': { color: '#FA3E31', Icon: MusicIcon },
    'application/pdf': { color: '#2146B5', Icon: DocumentsIcon },
};

export const getFileDetails = (mimeType: string): FileTypeMappingProps => {
    const { theme } = useTheme();

    if (mimeType in fileTypeMappings) {
        return fileTypeMappings[mimeType];
    }

    return {
        color: theme === 'dark' ? '#D6E6E6' : '#555C5C',
        Icon: OtherIcon,
    };
};
