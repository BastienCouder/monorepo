'use client';

import { CheckCircle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { updateProgress } from '@/app/(dashboard)/dashboard/action/update-progress';

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  isCompleted?: boolean;
  nextChapterId?: string;
}

export const CourseProgressButton = ({
  // eslint-disable-next-line no-unused-vars
  chapterId,
  courseId,
  isCompleted,
  nextChapterId,
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      await updateProgress(chapterId);

      if (!isCompleted && !nextChapterId) {
        return;
      }

      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

      toast({
        title: 'Mise à jour des progrès',
      });
      router.refresh();
    } catch {
      toast({
        title: "Une erreur s'est produite",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = isCompleted ? CheckCircle : XCircle;

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      type="button"
      variant={isCompleted ? 'success' : 'outline'}
      className="w-full md:w-auto"
    >
      {isCompleted ? 'Marquer comme terminé' : 'Non terminé'}
      <Icon className="h-4 w-4 ml-2" />
    </Button>
  );
};
