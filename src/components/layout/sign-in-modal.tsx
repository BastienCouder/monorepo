'use client';

import { useState } from 'react';
import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { useSigninModal } from '@/hooks/use-signin-modal';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Modal } from '../shared/modal';

export const SignInModal = () => {
  const t = useTranslations('navbar');
  const signInModal = useSigninModal();
  const [signInClicked, setSignInClicked] = useState(false);

  return (
    <Modal showModal={signInModal.isOpen} setShowModal={signInModal.onClose}>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16">
          <a href={siteConfig.url}>
            <Icons.logo className="size-10" />
          </a>
          <h3 className="font-urban text-2xl font-bold">{t('sign_in')}</h3>
          <p className="text-sm text-gray-500">{t('get_connected_quickly_with_google')}</p>
        </div>

        <div className="flex flex-col space-y-4 bg-secondary/50 px-4 py-8 md:px-16">
          <Button
            variant="default"
            disabled={signInClicked}
            onClick={() => {
              setSignInClicked(true);
              signIn('google', { redirect: false }).then(() =>
                setTimeout(() => {
                  signInModal.onClose();
                }, 1000)
              );
            }}
          >
            {signInClicked ? (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 size-4" />
            )}{' '}
            {t('sign_in_with_google')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
