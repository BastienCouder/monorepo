import { LucideIcon } from 'lucide-react';
import React from 'react';

interface FeatureProps {
  id: string;
  name: string;
  Icon: LucideIcon;
  description: string;
}

export default function Feature({ id, name, Icon, description }: FeatureProps) {
  return (
    <li
      key={id}
      className="w-full lg:w-auto border bg-background rounded-md flex items-center gap-4 p-4"
    >
      <div>
        <Icon size={30} />
      </div>
      <div>
        <p className="font-bold">{name}</p>
        <p className="text-xs text-primary">{description}</p>
      </div>
    </li>
  );
}
