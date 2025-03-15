'use client';

import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function Error({ reset }: { reset: () => void }) {
  const t = useTranslations('error');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="mb-5 text-center">{t('something_went_wrong')}</h2>
      <Button type="submit" variant="default" onClick={() => reset()}>
        {t('try_again')}
      </Button>
    </div>
  );
}
