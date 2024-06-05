'use client';

import { useCallback, useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import { useSearchParams } from 'next/navigation';
import { newVerification } from '@/server/auth/new-verification';
import { CardWrapper } from './card-wrapper';
import { FormSuccess } from '../form/form-success';
import { FormError } from '../form/form-error';
import { useTranslations } from 'next-intl';
import { catchError } from '@/lib/catch-error';

export const NewVerificationForm = () => {
  const t = useTranslations('auth.client');
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError(t('missing_token'));
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        catchError(t('something_went_wrong'));
      });
  }, [token, success, error, t]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel={t('confirming_verification')}
      backButtonLabel={t('back_to_login')}
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};
