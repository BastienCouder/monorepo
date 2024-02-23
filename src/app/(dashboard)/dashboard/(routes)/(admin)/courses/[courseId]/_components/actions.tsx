'use client';

import { Trash } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { ConfirmModal } from '@/components/modal/confirm-modal';
import { toast } from '@/components/ui/use-toast';
import { admin } from '@/app/(auth)/actions/admin.action';
import { toggleCoursePublication } from '@/app/(dashboard)/action/toggle-publish-course';

interface ActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    const adminResponse = await admin();
    if (adminResponse.error) {
      toast({
        title: adminResponse.error,
      });
      return;
    }

    try {
      setIsLoading(true);

      if (isPublished) {
        await toggleCoursePublication(courseId, false);
        toast({
          title: 'Course unpublished',
        });
      } else {
        await toggleCoursePublication(courseId, true);
        toast({
          title: 'Course published',
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
    const adminResponse = await admin();
    if (adminResponse.error) {
      toast({
        title: adminResponse.error,
      });
      return;
    }

    try {
      setIsLoading(true);

      //   await axios.delete(`/api/courses/${courseId}`);
      toast({
        title: 'Course deleted',
      });
      router.refresh();
      router.push(`/teacher/courses`);
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
