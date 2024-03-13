'use client';

import React, { useState } from 'react';
import { Category, CategoryOnCourse, Course } from '@/schemas/db-schema';
import CourseCard from './course-card';
import { Favorite } from '@prisma/client';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button, buttonVariants } from './ui/button';
import { cn } from '@/lib/utils';
import { Categories } from '@/app/(app)/(routes)/courses/_components/categories';
import { usePathname } from 'next/navigation';

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface CoursesListProps {
  items: CourseWithProgressWithCategory[];
  favorites?: Favorite[];
  categories?: CategoryOnCourse;
}

export const CoursesList = ({
  items,
  favorites,
  categories,
}: CoursesListProps) => {
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const pathname = usePathname();

  const filteredItems = showOnlyFavorites
    ? items.filter((item) =>
        favorites?.some((favorite) => favorite.courseId === item.id)
      )
    : items;

  return (
    <div className="space-y-2">
      {pathname === '/courses' && (
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger
              className={cn(
                buttonVariants({ variant: 'default' }),
                'text-background'
              )}
            >
              Catégories
            </PopoverTrigger>
            <PopoverContent>
              <Categories items={categories} />
            </PopoverContent>
          </Popover>
          <Button
            variant={'ghost'}
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          >
            {showOnlyFavorites
              ? 'Voir tous les cours'
              : 'Voir seulement les favoris'}
          </Button>
        </div>
      )}{' '}
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <CourseCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl!}
            chaptersLength={item.chapters.length}
            price={item.price!}
            progress={item.progress}
            categories={item?.categories}
            favorite={favorites?.some(
              (favorite) => favorite.courseId === item.id
            )}
          />
        ))}
      </div>
      {filteredItems.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          {showOnlyFavorites ? 'Aucun favori trouvé' : 'Aucun cours trouvé'}
        </div>
      )}
    </div>
  );
};
