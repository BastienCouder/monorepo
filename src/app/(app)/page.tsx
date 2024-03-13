import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/user-nav';
import { currentUser } from '@/lib/authCheck';
import Link from 'next/link';
import CardCategory from './_components/card-category';
import Nav from './_components/nav';
import { Book, CircleDollarSign, History } from 'lucide-react';
import Feature from './_components/feature';
import { db } from '@/lib/prisma';
import { Separator } from '@/components/ui/separator';

async function getCategoriesWithCourseCount() {
  const categoriesWithCount = await db.category.findMany({
    include: {
      _count: {
        select: { courses: true },
      },
    },
  });
  return categoriesWithCount;
}

export default async function Home() {
  // eslint-disable-next-line no-unused-vars
  const user = await currentUser();
  const categoriesWithCount = await getCategoriesWithCourseCount();

  const features = [
    {
      id: '1',
      name: 'Cours Gratuit',
      Icon: CircleDollarSign,
      description: 'Accès illimité à une sélection variée de cours gratuits',
    },
    {
      id: '2',
      name: 'Suivi des Progrès en Temps Réel',
      Icon: History,
      description: 'Fonctionnalité permettant de suivre tes progrès ',
    },
    {
      id: '3',
      name: "Plateforme d'Apprentissage Dynamique",
      Icon: Book,
      description:
        'Nous offrons des cours enrichis qui encouragent la participation active et le renforcement des connaissances.',
    },
  ];

  return (
    <div className="flex min-h-screen relative flex-col">
      <div className="w-full flex items-center justify-end p-4 space-x-4 absolute bg-background border-b">
        <Nav />
        <ModeToggle />
        {user ? (
          <UserNav
            user={{
              name: user?.name ?? 'N/A',
              email: user?.email ?? 'N/A',
            }}
          />
        ) : (
          <Link href="/login">
            <Button>Connexion</Button>
          </Link>
        )}
      </div>
      <div className="pt-44 space-y-8 py-8">
        <section className="flex w-full py-8 px-6 lg:px-12 bg-card">
          <ul className="w-full flex flex-wrap justify-center gap-6">
            {features.map((item) => {
              return (
                <Feature
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  Icon={item.Icon}
                  description={item.description}
                />
              );
            })}
          </ul>
        </section>
        <section className="w-full flex flex-col items-center space-y-6 px-6 lg:px-12">
          <h2 className="font-bold text-lg border-b border-6 border-primary">
            Top Catégories
          </h2>
          <Separator />
          <ul className="w-full flex flex-wrap">
            {categoriesWithCount.map((item) => {
              return (
                <CardCategory
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  count={item._count}
                  // Icon={item.Icon}
                />
              );
            })}
          </ul>
        </section>
      </div>
      <p className="p-4 text-xs text-primary">
        Travail pédagogique sans objectifs commerciaux - © Bastien Couder
      </p>
    </div>
  );
}
