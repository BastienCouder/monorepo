'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { BookOpen, Star, StarIcon } from 'lucide-react';

import { IconBadge } from '@/components/icon-badge';
import { CourseProgress } from '@/components/course-progress';
import { Category } from '@/schemas/db-schema';
import { Badge } from './ui/badge';
import { toggleFavorite } from '@/app/(dashboard)/dashboard/(routes)/courses/action/action/toggle-favorites';
import { toast } from './ui/use-toast';

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  categories: Category[];
  isFavorited?: boolean; // Optional prop to indicate initial favorite state
}

export default function CourseCard({
  id,
  title,
  imageUrl,
  chaptersLength,
  progress,
  categories,
  isFavorited = false,
}: CourseCardProps) {
  const [favorited, setFavorited] = useState(isFavorited);

  const handleToggleFavorite = async (courseId: string) => {
    try {
      const res = await toggleFavorite(courseId);
      toast({
        title: res.success,
      });
      setFavorited((prev) => !prev);
    } catch (error) {
      toast({
        title: "une erreur s'est produite",
      });
      console.error('Failed to toggle favorite status', error);
    }
  };

  return (
    <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full  relative">
      <Link href={`/courses/${id}`}>
        <div className="cursor-pointer relative w-full aspect-video rounded-md overflow-hidden">
          <Image fill className="object-cover" alt={title} src={imageUrl} />
        </div>
      </Link>
      <div className="flex flex-col pt-4 gap-2">
        <div className="w-full flex justify-between gap-2 items-center text-lg md:text-base font-medium group-hover:text-primary transition line-clamp-2">
          {title}
          <button
            type="button"
            onClick={() => handleToggleFavorite(id)}
            aria-label={
              favorited ? 'Remove from favorites' : 'Add to favorites'
            }
          >
            {favorited ? (
              <StarIcon className="text-yellow-400 h-5 w-5" />
            ) : (
              <Star className="text-gray-400 hover:text-yellow-400 h-5 w-5" />
            )}
          </button>
        </div>
        <ul className="flex gap-2">
          {categories.map((cat, index) => (
            <li key={index} className="text-xs text-muted-foreground">
              <Badge>{cat.category.name}</Badge>
            </li>
          ))}
        </ul>
        <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
          <div className="flex items-center gap-x-2 text-slate-500">
            <IconBadge size="sm" icon={BookOpen} />
            <span>
              {chaptersLength} {chaptersLength === 1 ? 'Chapitre' : 'Chapitres'}
            </span>
          </div>
        </div>
        {progress !== null ? (
          <CourseProgress
            variant={progress === 100 ? 'success' : 'default'}
            size="sm"
            value={progress}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
