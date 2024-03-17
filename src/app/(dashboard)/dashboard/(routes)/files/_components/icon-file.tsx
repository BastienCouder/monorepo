import {
  AiFillFileText,
  AiFillVideoCamera,
  AiFillAudio,
  AiFillFilePdf,
  AiFillFileImage,
} from 'react-icons/ai';
import { FaFileWord, FaFileExcel, FaFilePowerpoint } from 'react-icons/fa';

const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <AiFillFileImage size={30} />;
    case 'mp4':
    case 'avi':
    case 'mov':
      return <AiFillVideoCamera size={30} />;
    case 'mp3':
    case 'wav':
    case 'aac':
      return <AiFillAudio size={30} />;
    case 'pdf':
      return <AiFillFilePdf size={30} />;
    case 'doc':
    case 'docx':
      return <FaFileWord size={30} />;
    case 'xls':
    case 'xlsx':
      return <FaFileExcel size={30} />;
    case 'ppt':
    case 'pptx':
      return <FaFilePowerpoint size={30} />;
    default:
      return <AiFillFileText size={30} />;
  }
};

export default getFileIcon;
