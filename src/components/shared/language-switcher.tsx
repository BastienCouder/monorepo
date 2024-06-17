'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { localeNames } from '@/config';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from '@/navigation';
import { useLocale } from 'next-intl';
import { buttonVariants } from '../ui/button';
import { Container, Text } from '@/components/container';

interface LangSwitcherProps {
  isCollapsed?: boolean;
}
export const LangSwitcher = ({ isCollapsed }: LangSwitcherProps) => {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

  const handleSwitchLanguage = (value: string) => {
    router.push(pathname, { locale: value });
  };

  const SelectedFlag = localeNames[locale]?.flag;

  return (
    <Select value={locale} onValueChange={handleSwitchLanguage}>
      {isCollapsed ? (
        <SelectTrigger
          showCaret={false}
          aria-label="select language"
          className={cn(
            `border-none shadow-none w-fit space-x-2  ${buttonVariants({ variant: 'outline', size: 'sm' })}`
          )}
        >
          {SelectedFlag && (
            <SelectedFlag width={20} height={20} className="w-5 h-5" />
          )}
        </SelectTrigger>
      ) : (
        <SelectTrigger
          aria-label="select language"
          className={cn(
            `w-fit space-x-2  ${buttonVariants({ variant: 'outline', size: 'sm' })}`
          )}
        >
          {SelectedFlag && (
            <SelectedFlag width={20} height={20} className="w-5 h-5" />
          )}
        </SelectTrigger>
      )}

      <SelectContent side="right" sideOffset={0.5} className="min-w-[7rem]">
        {Object.keys(localeNames).map((key: string) => {
          const { name, flag: Flag } = localeNames[key];
          return (
            <SelectItem
              aria-label={key}
              className="cursor-pointer flex flex-row items-center space-x-2"
              key={key}
              value={key}
            >
              <Container.Div className="flex flex-row">
                <Flag width={20} height={20} className="w-5 h-5 mr-2" />
                <Text.Span>{name}</Text.Span>
              </Container.Div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
