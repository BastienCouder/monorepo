import React, { ReactNode, ElementType } from 'react';

interface TextContainerProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  [key: string]: any;
}

const TextContainerBase = ({
  as: Component = 'p',
  children,
  className,
  ...props
}: TextContainerProps) => {
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};

export const TextContainer = {
  P: ({ className, ...props }: TextContainerProps) => (
    <TextContainerBase as="p" className={`text-base ${className}`} {...props} />
  ),
  Span: ({ className, ...props }: TextContainerProps) => (
    <TextContainerBase
      as="span"
      className={`text-sm ${className}`}
      {...props}
    />
  ),
  Small: ({ className, ...props }: TextContainerProps) => (
    <TextContainerBase
      as="small"
      className={`text-xs ${className}`}
      {...props}
    />
  ),
  H1: ({ className, ...props }: TextContainerProps) => (
    <TextContainerBase
      as="h1"
      className={`text-2xl font-bold ${className}`}
      {...props}
    />
  ),
  H2: ({ className, ...props }: TextContainerProps) => (
    <TextContainerBase
      as="h2"
      className={`text-xl font-bold ${className}`}
      {...props}
    />
  ),
  H3: ({ className, ...props }: TextContainerProps) => (
    <TextContainerBase
      as="h3"
      className={`text-lg font-bold ${className}`}
      {...props}
    />
  ),
  H4: ({ className, ...props }: TextContainerProps) => (
    <TextContainerBase
      as="h4"
      className={`text-base font-bold ${className}`}
      {...props}
    />
  ),
  H5: ({ className, ...props }: TextContainerProps) => (
    <TextContainerBase
      as="h5"
      className={`text-base font-bold ${className}`}
      {...props}
    />
  ),
  H6: ({ className, ...props }: TextContainerProps) => (
    <TextContainerBase
      as="h6"
      className={`text-base font-bold ${className}`}
      {...props}
    />
  ),
};
