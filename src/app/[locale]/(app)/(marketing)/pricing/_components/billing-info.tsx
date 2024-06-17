import * as React from 'react';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { UserSubscriptionPlan } from '@/types';
import { useTranslations } from 'next-intl';

interface BillingInfoProps extends React.HTMLAttributes<HTMLFormElement> {
  subscriptionPlan?: UserSubscriptionPlan;
}

export function BillingInfo({ subscriptionPlan }: BillingInfoProps) {
  const t = useTranslations();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('subscription_plan')}</CardTitle>
        <CardDescription>
          {t('current_plan', { title: subscriptionPlan?.title })}
        </CardDescription>
      </CardHeader>
      <CardContent>{subscriptionPlan?.description}</CardContent>
      <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between md:space-x-0">
        <Link href="/pricing" className={cn(buttonVariants())}>
          {subscriptionPlan?.isPaid
            ? t('manage_subscription')
            : t('upgrade_now')}
        </Link>

        {subscriptionPlan?.isPaid ? (
          <p className="rounded-full text-xs font-medium">
            {subscriptionPlan.isCanceled
              ? t('plan_will_be_canceled_on', {
                  date: formatDate(subscriptionPlan.stripeCurrentPeriodEnd),
                })
              : t('plan_renews_on', {
                  date: formatDate(subscriptionPlan.stripeCurrentPeriodEnd),
                })}
          </p>
        ) : null}
      </CardFooter>
    </Card>
  );
}
