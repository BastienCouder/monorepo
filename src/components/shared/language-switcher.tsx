//LangSwitcher.tsx

import React, { useState } from 'react';
import Image from 'next/image';
import { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Button, buttonVariants } from '../ui/button';
// import gbFlag from "../assets/img/bg_flag.png";
// import geFlag from "../assets/img/german_flag.png";
// import esFlag from "../assets/img/spain_flag.png";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { Settings } from 'lucide-react';

const LangSwitcher: React.FC = () => {
  interface Option {
    country: string;
    code: string;
    flag: StaticImageData | string;
  }

  const router = useRouter();
  const pathname = usePathname();

  const [isOptionsExpanded, setIsOptionsExpanded] = useState(false);

  const options: Option[] = [
    { country: 'English', code: 'en', flag: 'gbFlag' },
    { country: 'Deutsch', code: 'de', flag: 'geFlag' },
    { country: 'French', code: 'fr', flag: 'frFlag' },
  ];

  const setOption = (option: Option) => {
    setIsOptionsExpanded(false);
    router.push(`/${option.code}`);
  };

  return (
    <>

    </>
  );
};

export default LangSwitcher;
