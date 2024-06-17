import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  File,
  FileText,
  HelpCircle,
  Image,
  Laptop,
  FileMinus,
  Loader2,
  LucideProps,
  Gauge,
  MoreVertical,
  Plus,
  Puzzle,
  Search,
  Trash,
  User,
  X,
  LucideIcon,
  ScanEye,
  Aperture,
} from 'lucide-react';
import { FaSun } from 'react-icons/fa';
import { RiSettings4Fill } from 'react-icons/ri';
import { IoDocumentText } from 'react-icons/io5';
import { IoCard } from 'react-icons/io5';
import { HiMiniPlusCircle } from 'react-icons/hi2';
import { IoMoon } from 'react-icons/io5';
import { IoSunny } from 'react-icons/io5';
import { RiDashboardFill } from 'react-icons/ri';
import { FaKey } from 'react-icons/fa6';
import { IoIosMail } from 'react-icons/io';
import { BiSolidEditAlt } from 'react-icons/bi';
import { FiUpload } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';

export type Icon = LucideIcon;

export const Icons = {
  add: Plus,
  arrowRight: ArrowRight,
  billing: IoCard,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  check: Check,
  close: X,
  dashboard: RiDashboardFill,
  document: IoDocumentText,
  edit: BiSolidEditAlt,
  ellipsis: MoreVertical,
  gitHub: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="github"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
      ></path>
    </svg>
  ),
  google: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="google"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 488 512"
      {...props}
    >
      <path
        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
        fill="currentColor"
      />
    </svg>
  ),
  help: HelpCircle,
  key: FaKey,
  laptop: Laptop,
  logo: Puzzle,
  mail: IoIosMail,
  media: Image,
  moon: IoMoon,
  page: File,
  plus: HiMiniPlusCircle,
  file: FileMinus,
  eye: ScanEye,
  aperture: Aperture,
  gauge: Gauge,
  post: FileText,
  search: Search,
  settings: RiSettings4Fill,
  spinner: Loader2,
  sun: IoSunny,
  trash: Trash,
  twitter: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="twitter"
      role="img"
      {...props}
    >
      <path
        d="M14.258 10.152L23.176 0h-2.113l-7.747 8.813L7.133 0H0l9.352 13.328L0 23.973h2.113l8.176-9.309 6.531 9.309h7.133zm-2.895 3.293l-.949-1.328L2.875 1.56h3.246l6.086 8.523.945 1.328 7.91 11.078h-3.246zm0 0"
        fill="currentColor"
      />
    </svg>
  ),
  user: User,
  circleUser: FaUserCircle,
  uploads: FiUpload,
  warning: AlertTriangle,
  drive: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="drive"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0  0 22 22"
      fill="none"
      {...props}
    >
      <path
        d="M11.015 16H20.5L18.485 20H9L11.015 16Z"
        stroke="#333333"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.6549 13.2162L11.0833 4.90559L15.5592 4.74316L20.1308 13.0538L15.6549 13.2162Z"
        stroke="#333333"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 15L8.16413 6.74096L10.6563 10.4624L5.99215 18.7215L3.5 15Z"
        stroke="#333333"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  sort: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="sort"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0  0 20 20"
      fill="none"
      {...props}
    >
      <path
        d="M10.875 4.00002C10.875 3.69877 10.6948 3.42676 10.4173 3.30934C10.1399 3.19192 9.81916 3.25188 9.60289 3.46159L5.47789 7.4616C5.33222 7.60285 5.25 7.79711 5.25 8.00002C5.25 8.20293 5.33222 8.39719 5.47789 8.53844L9.60289 12.5384C9.81916 12.7482 10.1399 12.8081 10.4173 12.6907C10.6948 12.5733 10.875 12.3013 10.875 12V8.75002L18 8.75002C18.4142 8.75002 18.75 8.41423 18.75 8.00002C18.75 7.58581 18.4142 7.25002 18 7.25002L10.875 7.25002V4.00002Z"
        fill="#1C274C"
      />
      <path
        opacity="0.5"
        d="M13.125 12C13.125 11.6988 13.3052 11.4268 13.5827 11.3093C13.8601 11.1919 14.1808 11.2519 14.3971 11.4616L18.5221 15.4616C18.6678 15.6029 18.75 15.7971 18.75 16C18.75 16.2029 18.6678 16.3972 18.5221 16.5384L14.3971 20.5384C14.1808 20.7482 13.8601 20.8081 13.5827 20.6907C13.3052 20.5733 13.125 20.3013 13.125 20V16.75H6C5.58579 16.75 5.25 16.4142 5.25 16C5.25 15.5858 5.58579 15.25 6 15.25L13.125 15.25L13.125 12Z"
        fill="#1C274C"
      />
    </svg>
  ),
  light: FaSun,
};
