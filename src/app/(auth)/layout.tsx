import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      {children}
    </div>
  );
};

export default AuthLayout;
