'use client';

import { Quiz } from '@prisma/client';
import { useEffect, useState } from 'react';
import { Grip, Pencil } from 'lucide-react';

import { cn } from '@/lib/utils';

interface QuizListProps {
  items: Quiz[];
  // eslint-disable-next-line no-unused-vars
  onEdit: (id: string) => void;
}

export const QuizList = ({ items, onEdit }: QuizListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [quizs, setQuizs] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setQuizs(items);
  }, [items]);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      {quizs.map((quiz) => (
        <div key={quiz.id}>
          <div
            className={cn(
              'flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm'
            )}
          >
            <div
              className={cn(
                'px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition'
              )}
            >
              <Grip className="h-5 w-5" />
            </div>
            {quiz.title}
            <div className="ml-auto pr-2 flex items-center gap-x-2">
              <Pencil
                onClick={() => onEdit(quiz.id)}
                className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
