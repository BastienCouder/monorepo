'use client';

import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { Grip, Pencil } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Content } from '@/schemas/db-schema';

interface ContentsListProps {
  items: Content[];
  // eslint-disable-next-line no-unused-vars
  onReorder: (updateData: { id: string; position: number }[]) => void;
  // eslint-disable-next-line no-unused-vars
  onEdit: (id: string) => void;
}

export const ContentsList = ({
  items,
  onReorder,
  onEdit,
}: ContentsListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [contents, setContents] = useState(items);

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

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedContents = items.slice(startIndex, endIndex + 1);

    setContents(items);

    const bulkUpdateData = updatedContents.map((content) => ({
      id: content.id,
      position: items.findIndex((item) => item.id === content.id),
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }

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
                      <Button
                        aria-label="Modifier le code"
                        size="sm"
                        variant={'ghost'}
                      >
                        <Pencil
                          aria-label="icon stylo"
                          onClick={() => onEdit(content.id)}
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
