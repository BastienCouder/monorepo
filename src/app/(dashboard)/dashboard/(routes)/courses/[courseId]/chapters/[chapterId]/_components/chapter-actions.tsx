'use client';

import { Trash } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/modal/confirm-modal';
import { toast } from '@/components/ui/use-toast';
import { toggleChapterPublication } from '@/app/(dashboard)/dashboard/action/toggle-publish-chapter';
import { deleteChapter } from '@/app/(dashboard)/dashboard/action/delete-chapter';

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

export const ChapterActions = ({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: ChapterActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await toggleChapterPublication(chapterId, false);
        toast({
          title: 'Chapitre non publié',
        });
      } else {
        await toggleChapterPublication(chapterId, true);
        toast({
          title: 'Chapitre publié',
        });
      }

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

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await deleteChapter(chapterId);

      toast({
        title: 'Chapitre supprimé',
      });
      router.refresh();
      router.push(`/dashboard/courses/${courseId}`);
    } catch {
      toast({
        title: "Une erreur s'est produite",
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
