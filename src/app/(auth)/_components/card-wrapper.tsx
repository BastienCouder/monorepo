import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Separator,
} from '@/components/ui';
import { BackButton, Social } from '.';
import React from 'react';
import { useTranslations } from 'next-intl';
import { Container, Link } from '@/components/container';
import { Text } from '@/components/container';

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  const t = useTranslations('auth.client');

  return (
    <Card className="w-[450px] space-y-2 pt-4 shadow-md rounded-md">
      {headerLabel}
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <Container.Div className="w-full flex items-center px-6">
        <Separator className="w-2/5 h-[2px] bg-primary" />
        <Text.H2 className="w-1/5 px-8 -mt-1 flex justify-center items-center font-bold">
          {t('or')}
        </Text.H2>
        <Separator className="w-2/5 h-[2px] bg-primary" />
      </Container.Div>
      <CardContent className="pt-4 pb-0">{children}</CardContent>
      <CardFooter className="flex flex-col gap-2">
        <BackButton label={backButtonLabel} href={backButtonHref} />
        <Link href={'/'} className="w-full flex justify-center items-center ">
          <Button className="w-1/2">{t('back_to_app')}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
