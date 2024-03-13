'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

export const CourseEnrollButton = ({
  // eslint-disable-next-line no-unused-vars
  price,
  // eslint-disable-next-line no-unused-vars
  courseId,
}: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      //     const response = await axios.post(`/api/courses/${courseId}/checkout`);

      //   window.location.assign(response.data.url);
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
    <Link href={'/login'}>
      <Button
        onClick={onClick}
        disabled={isLoading}
        size="sm"
        className="w-full md:w-auto"
      >
        {/* S'inscrire pour {formatPrice(price)} */}
        Connexion
      </Button>
    </Link>
  );
};
