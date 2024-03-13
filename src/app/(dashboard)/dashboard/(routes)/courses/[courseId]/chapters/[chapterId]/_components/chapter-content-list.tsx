'use client';

import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { Grip, Pencil, Trash } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Content } from '@/schemas/db-schema';
import { ConfirmModal } from '@/components/modal/confirm-modal';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { deleteContent } from '@/app/(dashboard)/dashboard/action/delete-content';

interface ContentsListProps {
  items: Content[];
  // eslint-disable-next-line no-unused-vars
  onReorder: (updateData: { id: string; position: number }[]) => void;
  // eslint-disable-next-line no-unused-vars
  onEdit: (id: string, type: string) => void;
}

export const ContentsList = ({
  items,
  onReorder,
  onEdit,
}: ContentsListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [contents, setContents] = useState(items);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setContents(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(contents);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setContents(items);
    const bulkUpdateData = items.map((item, index) => ({
      id: item.id,
      position: index + 1,
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }

  const onDelete = async (quizId: string) => {
    try {
      setIsLoading(true);

      await deleteContent(quizId);
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
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="contents">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {contents.map((content, index) => (
              <Draggable
                key={content.id}
                draggableId={content.id}
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      'flex items-center gap-x-2 bg-input border text-foreground rounded-md mb-4 text-sm',
                      content.isPublished &&
                        'bg-primary border-primary text-foreground'
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        'px-2 py-3 border-r border-r-primary rounded-l-md transition',
                        content.isPublished &&
                          'border-r-primary hover:bg-primary'
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" aria-label="icon grille" />
                    </div>
                    {content.title}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      <ConfirmModal onConfirm={() => onDelete(content.id)}>
                        <Button
                          size="sm"
                          disabled={isLoading}
                          variant={'ghost'}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </ConfirmModal>
                      <Button
                        aria-label="Modifier le code"
                        size="sm"
                        variant={'ghost'}
                        onClick={() =>
                          onEdit(
                            content.id,
                            content.code !== ''
                              ? 'code'
                              : content.description !== ''
                                ? 'description'
                                : 'image'
                          )
                        }
                      >
                        <Pencil
                          aria-label="icon stylo"
                          className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                        />
                      </Button>
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
