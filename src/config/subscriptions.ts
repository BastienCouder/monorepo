import { SubscriptionPlan } from '@/types';
import { env } from '@/env.mjs';

export const pricingData: SubscriptionPlan[] = [
  {
    title: 'Freemium',
    description: 'For Beginners',
    benefits: [
      'Up to 100 monthly posts',
      'Basic analytics and reporting',
      'Access to standard templates',
    ],
    limitations: [
      'No priority access to new features.',
      'Limited customer support',
      'No custom branding',
      'Limited access to business resources.',
    ],
    prices: {
      monthly: 0,
      yearly: 0,
    },
    stripeIds: {
      monthly: null,
      yearly: null,
    },
    userStorageLimit: 500000000, // 5 GB for individual users
    teamStorageLimit: 1000000000, // 10 GB for teams
  },
  {
    title: 'Advenced',
    description: 'Unlock Advanced Features',
    benefits: [
      'Up to 500 monthly posts',
      'Advanced analytics and reporting',
      'Access to business templates',
      'Priority customer support',
      'Exclusive webinars and training.',
    ],
    limitations: [
      'No custom branding',
      'Limited access to business resources.',
    ],
    prices: {
      monthly: 12,
      yearly: 120,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_ADVENCED_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_ADVENCED_YEARLY_PLAN_ID,
    },
    userStorageLimit: 500000000, // 5 GB for individual users
    teamStorageLimit: 1000000000, // 10 GB for teams
  },
  {
    title: 'Pro',
    description: 'Unlock Advanced Features',
    benefits: [
      'Up to 500 monthly posts',
      'Advanced analytics and reporting',
      'Access to business templates',
      'Priority customer support',
      'Exclusive webinars and training.',
    ],
    limitations: [
      'No custom branding',
      'Limited access to business resources.',
    ],
    prices: {
      monthly: 27,
      yearly: 220,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    },
    userStorageLimit: 500000000, // 5 GB for individual users
    teamStorageLimit: 1000000000, // 10 GB for teams
  },
  {
    title: 'Business',
    description: 'For Power Users',
    benefits: [
      'Unlimited posts',
      'Real-time analytics and reporting',
      'Access to all templates, including custom branding',
      '24/7 business customer support',
      'Personalized onboarding and account management.',
    ],
    limitations: [],
    prices: {
      monthly: 30,
      yearly: 300,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID,
    },
    userStorageLimit: 500000000, // 5 GB for individual users
    teamStorageLimit: 1000000000, // 10 GB for teams
  },
];
