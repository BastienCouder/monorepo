'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Folder } from '@/schemas/db';

type SelectFolderFilesFormValues = z.infer<typeof SelectFolderFilesSchema>;

const defaultValues: Partial<SelectFolderFilesFormValues> = {};

type FormType = {
  index: number;
  folder: Folder;
};

const SelectFolderFilesSchema = z.object({
  selectedFolders: z.array(z.string()).optional(),
});

export function SelectFolderFilesForm({ folder, index }: FormType) {
  const [loading, setLoading] = useState(false);
  const form = useForm<SelectFolderFilesFormValues>({
    resolver: zodResolver(SelectFolderFilesSchema),
    defaultValues: { selectedFolders: [] },
    mode: 'onChange',
  });

  async function onSubmit(data: SelectFolderFilesFormValues) {
    setLoading(true);
    setLoading(false);
  }

  const handleCheckedChange = (checked: boolean) => {
    const selectedFolders = form.getValues('selectedFolders') || [];
    if (checked) {
      form.setValue('selectedFolders', [...selectedFolders, folder.id]);
    } else {
      form.setValue(
        'selectedFolders',
        selectedFolders.filter((id: string) => id !== folder.id)
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Checkbox
          checked={form.watch(`selectedFolders`)?.includes(folder.id)}
          onCheckedChange={handleCheckedChange}
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </Button>
      </form>
    </Form>
  );
}
