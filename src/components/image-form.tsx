'use client';

import * as z from 'zod';
import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { FileUpload } from '@/components/file-upload';

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: 'Image is required',
  }),
});

export const ImageForm = () => {
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(`/api/courses/`, {
        method: 'PATCH', // Spécifiez la méthode PATCH pour la mise à jour
        headers: {
          'Content-Type': 'application/json', // Indique que le corps de la requête est au format JSON
        },
        body: JSON.stringify(values), // Convertit les valeurs du formulaire en chaîne JSON
      });

      if (!response.ok) {
        throw new Error('Network response was not ok'); // Gère les réponses non réussies
      }

      // Traitez ici la réponse si nécessaire, par exemple, convertir JSON en objet JavaScript
      // const data = await response.json();

      //   toast.success('Course updated');
      router.refresh(); // Rafraîchit la page ou les données affichées
    } catch (error) {
      console.error('Error updating course:', error);
      //   toast.error('Something went wrong');
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course image
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      </div>
    </div>
  );
};
