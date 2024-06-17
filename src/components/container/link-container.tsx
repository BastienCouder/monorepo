import React, { ReactNode } from 'react';
import Link from 'next/link';

interface AContainerProps {
  children: ReactNode;
  className?: string;
  href: string;
  [key: string]: any;
}

export const LinkContainer = ({
  children,
  className,
  href,
  ...props
}: AContainerProps) => {
  return (
    <Link className={className} href={href} {...props}>
      {children}
    </Link>
  );
};
