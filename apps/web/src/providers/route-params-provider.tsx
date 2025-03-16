'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type RouteParamContextType = {
  param: string | null;
  setParam: (param: string | null) => void;
};

const RouteParamContext = createContext<RouteParamContextType | undefined>(
  undefined
);

export const RouteParamProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [param, setParam] = useState<string | null>(null);

  return (
    <RouteParamContext.Provider value={{ param, setParam }}>
      {children}
    </RouteParamContext.Provider>
  );
};

export const useRouteParam = (): RouteParamContextType => {
  const context = useContext(RouteParamContext);
  if (context === undefined) {
    throw new Error('useRouteParam must be used within a RouteParamProvider');
  }
  return context;
};
