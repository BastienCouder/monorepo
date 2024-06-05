import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';


export const Header = () => {
  const pathname = usePathname();
  const t = useTranslations('auth.client');

  return (
    <div className="flex w-full h-10 mb-6">
      <Link
        href={'/login'}
        className={`border pl-4 flex justify-start items-center rounded-tl-md w-1/2 ${pathname === '/login' ? 'bg-primary text-white h-12 -mt-2' : 'bg-card cursor-pointer'} transition-all`}
      >
        <h2 className="first-letter:uppercase font-bold">{t('login')}</h2>
      </Link>
      <Link
        href={'/register'}
        className={`border pl-4 flex justify-start items-center rounded-tr-md w-1/2 ${pathname === '/register' ? 'bg-primary text-white h-12 -mt-2' : 'bg-card cursor-pointer'} transition-all`}
      >
        <h2 className="first-letter:uppercase font-bold">{t('create_account')}</h2>
      </Link>
    </div>
  );
};
