import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { useTranslations } from 'next-intl';

export const ErrorCard = () => {
  const t = useTranslations('auth.client');

  return (
    <CardWrapper
      headerLabel={t('oops_something_wrong')}
      backButtonHref="/auth/login"
      backButtonLabel={t('back_to_login')}
    >
      <div className="w-full flex justify-center items-center">
        <ExclamationTriangleIcon className="text-destructive" />
      </div>
    </CardWrapper>
  );
};
