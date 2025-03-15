import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Container, Link, Text } from '@/components/container';

export const Header = () => {
  const pathname = usePathname();
  const t = useTranslations('auth.client');

  return (
    <Container.Div className="flex w-full h-10 mb-6">
      <Link
        href={'/login'}
        className={`border pl-4 flex justify-start items-center rounded-tl-md w-1/2 ${pathname === '/login' ? 'bg-primary text-white h-12 -mt-2' : 'bg-card cursor-pointer'} transition-all`}
      >
        <Text.P className="text-lg first-letter:uppercase font-bold">
          {t('login')}
        </Text.P>
      </Link>
      <Link
        href={'/register'}
        className={`border pl-4 flex justify-start items-center rounded-tr-md w-1/2 ${pathname === '/register' ? 'bg-primary text-white h-12 -mt-2' : 'bg-card cursor-pointer'} transition-all`}
      >
        <Text.P className="text-lg first-letter:uppercase font-bold">
          {t('create_account')}
        </Text.P>
      </Link>
    </Container.Div>
  );
};
