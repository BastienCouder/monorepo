'use client';

import { Trash } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/modal/confirm-modal';
import { toast } from '@/components/ui/use-toast';
import { toggleQuizPublication } from '@/app/(dashboard)/dashboard/action/toggle-publish-quiz';

interface QuizActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  quizId: string;
  isPublished: boolean;
}

export const QuizActions = ({
  disabled,
  courseId,
  chapterId,
  quizId,
  isPublished,
}: QuizActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await toggleQuizPublication(quizId, false);

        toast({
          title: 'Quiz non publié',
        });
      } else {
        await toggleQuizPublication(quizId, true);

        toast({
          title: 'Quiz publié',
        });
      }

      router.refresh();
    } catch {
      toast({
        title: 'Une erreur est survenu',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      //   await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);

      toast({
        title: 'Quiz supprimé',
      });
      router.refresh();
      router.push(`/dashboard/courses/${courseId}/chapters/${chapterId}`);
    } catch {
      toast({
        title: 'Une erreur est survenu',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? 'Non publié' : 'Publié'}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
