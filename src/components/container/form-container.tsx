import React, { ReactNode } from 'react';

interface FormContainerProps {
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

export const FormContainer = ({
  children,
  className,
  ...props
}: FormContainerProps) => {
  return (
    <form className={className} {...props}>
      {children}
    </form>
  );
};
