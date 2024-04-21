import { env } from '@/lib/env';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Bienvenue sur le Tableau de Bord - ${env.NAME_WEBSITE}`,
    description: `Explorez votre tableau de bord ! Visualisez vos progrès, découvrez de nouveaux cours, et reprenez là où vous vous êtes arrêté. Tout ce dont vous avez besoin pour apprendre et progresser avec notre plateforme.`,
    robots: { index: false, follow: false, nocache: false },
  };
}

export default async function dashbaord() {
  return redirect(`/dashboard/files`);
}
