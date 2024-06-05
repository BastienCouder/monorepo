'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { localeNames } from '@/config';
import { usePathname, useRouter } from '@/navigation';
import { useLocale } from 'next-intl';

export const LangSwitcher = () => {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

  const handleSwitchLanguage = (value: string) => {
    router.push(pathname, { locale: value });
  };

  const SelectedFlag = localeNames[locale]?.flag;

  return (
    <Select value={locale} onValueChange={handleSwitchLanguage}>
      <SelectTrigger aria-label="select language" className="w-fit space-x-2">
        {SelectedFlag && <SelectedFlag width={20} height={20} className="w-5 h-5" />}
      </SelectTrigger>
      <SelectContent className='min-w-[7rem]'>
        {Object.keys(localeNames).map((key: string) => {
          const { name, flag: Flag } = localeNames[key];
          return (
            <SelectItem
              aria-label={key}
              className="cursor-pointer flex flex-row items-center space-x-2"
              key={key}
              value={key}
            >
              <div className='flex flex-row'>
                <Flag width={20} height={20} className="w-5 h-5 mr-2" />
                <p>{name}</p>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
