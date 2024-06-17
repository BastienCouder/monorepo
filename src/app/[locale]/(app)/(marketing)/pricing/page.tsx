import { currentUser } from '@/lib/auth';
import { getUserSubscriptionPlan } from '@/lib/subscription';
import { PricingCards } from './_components/pricing-cards';
import { PricingFaq } from './_components/pricing-faq';
import pick from 'lodash/pick';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export const metadata = {
  title: 'Pricing',
};

export default async function PricingPage() {
  const user = await currentUser();
  const messages = await getMessages();

  let subscriptionPlan;

  if (user) {
    subscriptionPlan = await getUserSubscriptionPlan(user.id);
  }

  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
      <NextIntlClientProvider messages={pick(messages, 'pricing')}>
        <PricingCards userId={user?.id} subscriptionPlan={subscriptionPlan} />
      </NextIntlClientProvider>
      <hr className="container" />
      <PricingFaq />
    </div>
  );
}
