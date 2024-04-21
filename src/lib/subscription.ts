'use server';
// @ts-nocheck
// TODO: Fix this when we turn strict mode on.
import { pricingData } from '@/config/subscriptions';
import { stripe } from '@/lib/stripe';
import { UserSubscriptionPlan } from '@/types';
import { db } from './prisma';

export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan> {
  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Check if user is on a paid plan.
  const isPaid =
    user.stripePriceId &&
    user.stripeCurrentPeriodEnd?.getTime()! + 86_400_000 > Date.now()
      ? true
      : false;

  // Find the pricing data corresponding to the user's plan
  const userPlan =
    pricingData.find((plan) => plan.stripeIds.monthly === user.stripePriceId) ||
    pricingData.find((plan) => plan.stripeIds.yearly === user.stripePriceId);

  const plan = isPaid && userPlan ? userPlan : pricingData[0];

  // Determine the interval of the subscription
  const interval = isPaid
    ? userPlan?.stripeIds.monthly === user.stripePriceId
      ? 'month'
      : 'year'
    : null;

  // Check if the subscription is set to cancel at the end of the period
  let isCanceled = false;
  if (isPaid && user.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      user.stripeSubscriptionId
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }

  // Update user storage limit based on their subscription plan
  if (plan.userStorageLimit) {
    await db.user.update({
      where: { id: userId },
      data: { storageLimit: plan.userStorageLimit },
    });
  }

  return {
    ...plan,
    ...user,
    stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd?.getTime()!,
    isPaid,
    interval,
    isCanceled,
  };
}
