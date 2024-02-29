'use client';

import { Quiz } from '@prisma/client';
import { useEffect, useState } from 'react';
import { NotepadText, Pencil, Trash } from 'lucide-react';

import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { ConfirmModal } from '@/components/modal/confirm-modal';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { deleteQuiz } from '../../../../action/action/delete-quiz';

interface QuizListProps {
  items: Quiz[];
  // eslint-disable-next-line no-unused-vars
  onEdit: (id: string) => void;
}

export const QuizList = ({ items, onEdit }: QuizListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [quizs, setQuizs] = useState(items);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setQuizs(items);
  }, [items]);

  if (!isMounted) {
    return null;
  }

  const onDelete = async (quizId: string) => {
    try {
      setIsLoading(true);

      await deleteQuiz(quizId);
      toast({
        title: 'Quiz supprimé',
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

  return (
    <div>
      {quizs.map((quiz) => (
        <div key={quiz.id}>
          <div
            className={cn(
              'flex items-center gap-x-2 bg-input border rounded-md mb-4 text-sm'
            )}
          >
            <div className={cn('px-2 py-3 border-r rounded-l-md transition')}>
              <NotepadText className="h-5 w-5" />
            </div>
            {quiz.title}
            <div className="ml-auto pr-2 flex items-center gap-x-2">
              <ConfirmModal onConfirm={() => onDelete(quiz.id)}>
                <Button size="sm" disabled={isLoading} variant={'secondary'}>
                  <Trash className="h-4 w-4" />
                </Button>
              </ConfirmModal>
              <Button size="sm" disabled={isLoading} variant={'secondary'}>
                <Pencil onClick={() => onEdit(quiz.id)} className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
