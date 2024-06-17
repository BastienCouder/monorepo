'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Icons } from '@/components/shared/icons';
import { Button, buttonVariants } from '@/components/ui/button';

import { useSigninModal } from '@/hooks/use-signin-modal';
import { UserSubscriptionPlan } from '@/types';
import { Separator } from '@/components/ui/separator';
import { BillingFormButton } from './billing-form-button';
import { useTranslations } from 'next-intl';
import { pricingData } from '@/config/subscriptions';

interface PricingCardsProps {
  userId?: string;
  subscriptionPlan?: UserSubscriptionPlan;
}

export function PricingCards({ userId, subscriptionPlan }: PricingCardsProps) {
  const t = useTranslations('pricing');

  const isYearlyDefault =
    !subscriptionPlan?.interval || subscriptionPlan.interval === 'year'
      ? false //true
      : false;
  const [isYearly, setIsYearly] = useState<boolean>(!!isYearlyDefault);
  const signInModal = useSigninModal();

  const toggleBilling = (interval: 'month' | 'year') => {
    setIsYearly(interval === 'year');
  };

  return (
    <section className="container flex flex-col items-center text-center">
      <div className="mx-auto mb-6 flex w-full flex-col gap-5">
        <p className="font-medium uppercase tracking-widest text-primary">
          {t('pricing')}
        </p>
        <h2 className="relative first-letter:uppercase font-heading text-3xl leading-[1.1] md:text-5xl">
          {t('plans_fit_scale')}
        </h2>
      </div>

      <div className="mx-auto grid max-w-screen gap-5 bg-inherit py-5 md:grid-cols-3 lg:grid-cols-3">
        {pricingData.map((offer) => (
          <div
            className="relative flex flex-col overflow-hidden rounded-xl border"
            key={offer.title}
          >
            <div className="flex justify-between space-x-4 p-6">
              <div className="flex flex-col">
                <p className="flex font-urban text-sm font-bold uppercase tracking-wider text-primary">
                  {offer.title}
                </p>
                <p className="flex justify-start font-urban text-sm text-muted-foreground">
                  {offer.description}
                </p>
              </div>
              <div className="flex flex-col">
                <div className="flex items-end">
                  <div className="flex flex-col font-semibold leading-2">
                    {isYearly && offer.prices.monthly > 0 ? (
                      <>
                        <span className="mr-2 text-lg text-muted-foreground line-through">
                          ${offer.prices.monthly}
                        </span>
                        <span className="text-base">
                          ${offer.prices.yearly / 12}
                        </span>
                      </>
                    ) : (
                      <div className="flex items-start">
                        <span className="text-4xl">
                          ${offer.prices.monthly}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="-mb-1 ml-2 text-left text-muted-foreground text-sm font-medium">
                    <div>{t('per_month')}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center w-full px-4">
              <Separator className="bg-primary" />
            </div>
            <div className="pt-4 px-4">
              {userId && subscriptionPlan ? (
                offer.title === 'Freemium' ? (
                  <Link
                    href="/dashboard"
                    className={buttonVariants({
                      className: 'w-full',
                      variant: 'default',
                    })}
                  >
                    {t('go_to_dashboard')}
                  </Link>
                ) : (
                  <BillingFormButton
                    year={isYearly}
                    offer={offer}
                    subscriptionPlan={subscriptionPlan}
                  />
                )
              ) : (
                <Button onClick={signInModal.onOpen}>{t('sign_in')}</Button>
              )}
            </div>
            <div className="flex w-full px-4 pt-4 flex-col items-start">
              <p className="font-semibold first-letter:uppercase">
                {t('features')}
              </p>
              <p className="text-sm text-muted-foreground first-letter:uppercase">
                {t('everything_in_plan', { plan: offer.title })}
              </p>
            </div>

            <div className="flex h-full flex-col justify-between gap-16 p-4">
              <ul className="space-y-2 text-left text-sm font-medium leading-normal">
                {offer.benefits.map((feature) => (
                  <li className="flex items-start" key={feature}>
                    <Icons.check className="mr-3 size-5 shrink-0 text-background border bg-primary rounded-full p-1" />
                    <p>{feature}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-balance text-center text-base text-muted-foreground">
        {t('contact_support', { email: 'couderbastien@gmail.com' })}
      </p>
    </section>
  );
}
