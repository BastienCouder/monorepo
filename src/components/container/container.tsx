import React, { ReactNode, ElementType } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  [key: string]: any;
}

const ContainerBase = ({
  as: Component = 'p',
  children,
  className,
  ...props
}: ContainerProps) => {
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};

export const Container = {
  Div: ({ className, ...props }: ContainerProps) => (
    <ContainerBase as="div" className={className} {...props} />
  ),
  Section: ({ className, ...props }: ContainerProps) => (
    <ContainerBase as="section" className={className} {...props} />
  ),
  Article: ({ className, ...props }: ContainerProps) => (
    <ContainerBase as="article" className={className} {...props} />
  ),
};
