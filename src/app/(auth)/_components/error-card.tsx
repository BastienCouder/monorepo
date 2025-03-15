import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { CardWrapper } from '@/app/(auth)/_components/card-wrapper';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/container';

export const ErrorCard = () => {
  const t = useTranslations('auth.client');

  return (
    <CardWrapper
      headerLabel={t('oops_something_wrong')}
      backButtonHref="/auth/login"
      backButtonLabel={t('back_to_login')}
    >
      <Container.Div className="w-full flex justify-center items-center">
        <ExclamationTriangleIcon className="text-destructive" />
      </Container.Div>
    </CardWrapper>
  );
};
