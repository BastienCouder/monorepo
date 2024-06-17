import React, { ReactNode } from 'react';

interface TouchContainerProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  [key: string]: any;
}

export const TouchContainer = ({
  children,
  className,
  onClick,
  ...props
}: TouchContainerProps) => {
  return (
    <span className={className} onClick={onClick} {...props}>
      {children}
    </span>
  );
};
