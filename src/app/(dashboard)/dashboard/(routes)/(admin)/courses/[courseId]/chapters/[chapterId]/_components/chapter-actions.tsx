'use client';

import { Trash } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/modal/confirm-modal';
import { toast } from '@/components/ui/use-toast';

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

export const ChapterActions = ({
  disabled,
  courseId,
  // eslint-disable-next-line no-unused-vars
  chapterId,
  isPublished,
}: ChapterActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        // await axios.patch(
        //   `/api/courses/${courseId}/chapters/${chapterId}/unpublish`
        // );
        toast({
          title: 'Chapter unpublished',
        });
      } else {
        // await axios.patch(
        //   `/api/courses/${courseId}/chapters/${chapterId}/publish`
        // );
        toast({
          title: 'Chapter published',
        });
      }

      router.refresh();
    } catch {
      toast({
        title: 'Something went wrong',
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
        title: 'Chapter deleted',
      });
      router.refresh();
      router.push(`/dashboard/courses/${courseId}`);
    } catch {
      toast({
        title: 'Something went wrong',
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
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
