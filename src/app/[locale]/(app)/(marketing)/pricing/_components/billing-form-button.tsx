'use client';

import { Icons } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import { generateUserStripe } from '@/server/generate-user-stripe';
import { SubscriptionPlan, UserSubscriptionPlan } from '@/types';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';

interface BillingFormButtonProps {
  offer: SubscriptionPlan;
  subscriptionPlan: UserSubscriptionPlan;
  year: boolean;
}

export function BillingFormButton({
  year,
  offer,
  subscriptionPlan,
}: BillingFormButtonProps) {
  const t = useTranslations('pricing');
  let [isPending, startTransition] = useTransition();
  const generateUserStripeSession = generateUserStripe.bind(
    null,
    offer.stripeIds[year ? 'yearly' : 'monthly']!
  );

  const stripeSessionAction = () => {
    startTransition(() => {
      generateUserStripeSession()
        .then(() => {
          // Handle success if needed
        })
        .catch((error) => {
          // Handle error if needed
          console.error(error);
        });
    });
  };

  return (
    <Button
      variant="default"
      className="w-full"
      disabled={isPending}
      onClick={stripeSessionAction}
    >
      {isPending ? (
        <>
          <Icons.spinner className="mr-2 size-4 animate-spin" /> {t('loading')}
        </>
      ) : (
        <>
          {subscriptionPlan.stripePriceId ===
          offer.stripeIds[year ? 'yearly' : 'monthly']
            ? t('manage_subscription')
            : t('get_started')}
        </>
      )}
    </Button>
  );
}
