'use client';

import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Questions } from '@/schemas/db-schema';
import React from 'react';

interface QuestionProps {
  question: Questions;
  form: any;
  questionIndex: number;
  responseDetail:
    | {
        isCorrect: boolean;
        optionIds: string[];
        questionId: string;
      }
    | undefined;
  defaultValues: any;
}

export default function QuestionAttempt({
  question,
  questionIndex,
  form,
  responseDetail,
}: QuestionProps) {
  const checkboxClass = responseDetail?.isCorrect
    ? 'text-green-500 bg-green-500'
    : 'text-red-500 bg-red-500';
  console.log(responseDetail);

  return (
    <div>
      <h3 className="mb-2 first-letter:uppercase">{question.label}</h3>
      {question.options.map((option) => {
        return (
          <React.Fragment key={option.id}>
            <FormField
              control={form.control}
              name={`answers[${questionIndex}].optionIds`}
              render={({ field }) => (
                <FormItem key={option.id} className="flex gap-x-4 items-center">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(option.id)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value, option.id])
                          : field.onChange(
                              field.value?.filter(
                                (value: string) => value !== option.id
                              )
                            );
                      }}
                      className={
                        field.value?.includes(option.id) ? checkboxClass : ''
                      } // Appliquer la classe conditionnelle
                    />
                  </FormControl>
                  <FormDescription className="text-primary pb-1">
                    {option.text}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}
