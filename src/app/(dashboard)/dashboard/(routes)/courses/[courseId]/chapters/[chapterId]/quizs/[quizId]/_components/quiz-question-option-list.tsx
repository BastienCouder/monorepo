'use client';

import { useEffect, useState } from 'react';
import { NotepadText, Pencil, Trash } from 'lucide-react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { ConfirmModal } from '@/components/modal/confirm-modal';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Questions } from '@/schemas/db-schema';
import { deleteQuestion } from '@/app/(dashboard)/dashboard/action/delete-question';

interface QuizListProps {
  items: Questions[];
  // eslint-disable-next-line no-unused-vars
  onReorder: (updateData: { id: string; position: number }[]) => void;
  // eslint-disable-next-line no-unused-vars
  onEdit: (id: string) => void;
}

export const QuestionsList = ({ items, onEdit, onReorder }: QuizListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [questions, setQuestions] = useState(items);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setQuestions(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedQuestions = items.slice(startIndex, endIndex + 1);

    setQuestions(items);

    const bulkUpdateData = updatedQuestions.map((question) => ({
      id: question.id as string,
      position: items.findIndex((item) => item.id === question.id),
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }

  const onDelete = async (questionId: string) => {
    try {
      setIsLoading(true);

      await deleteQuestion(questionId);

      toast({
        title: 'Question supprimé',
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
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="questionsList">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {questions.map((question, index) => (
              <Draggable
                key={question.id}
                draggableId={question.id as string}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="mb-4"
                  >
                    <div
                      className={cn(
                        'flex items-center gap-x-2 bg-input border rounded-md text-sm'
                      )}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className={cn(
                          'px-2 py-3 border-r rounded-l-md transition'
                        )}
                      >
                        <NotepadText className="h-5 w-5" />
                      </div>
                      {question.label}
                      <div className="ml-auto pr-2 flex items-center gap-x-2">
                        <ConfirmModal
                          onConfirm={() => onDelete(question.id as string)}
                        >
                          <Button
                            size="sm"
                            disabled={isLoading}
                            variant={'ghost'}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </ConfirmModal>

                        <Button
                          size="sm"
                          disabled={isLoading}
                          variant={'ghost'}
                          onClick={() => onEdit(question.id as string)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
