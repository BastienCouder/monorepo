/* eslint-disable no-unused-vars */

// Assurez-vous d'importer React si vous utilisez JSX
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface CardCategoryProps {
  id: string;
  name: string;
  // Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  count: { courses: number };
}

const CardCategory: React.FC<CardCategoryProps> = ({
  id,
  name,
  // Icon,
  count,
}: CardCategoryProps) => {
  return (
    <li key={id} className="w-1/2 sm:w-1/4">
      <Card className="rounded-none">
        <CardHeader></CardHeader>
        <CardContent>
          <div className="">
            {/* <Icon className="w-12 h-12" />{' '} */}
            {/* Ajustez la taille selon vos besoins */}
            <p className="font-bold first-letter:uppercase">{name}</p>
            <p className="text-xs text-primary">{count.courses} cours</p>
          </div>
        </CardContent>
      </Card>
    </li>
  );
};

export default CardCategory;
