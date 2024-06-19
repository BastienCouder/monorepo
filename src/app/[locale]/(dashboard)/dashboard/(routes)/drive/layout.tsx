import React from 'react';
import { Toaster } from 'sonner';

interface DriveLayoutProps {
  children?: React.ReactNode;
}

const DriveLayout = async ({ children }: DriveLayoutProps) => {
  return (
    <>
      <main
        className={`flex flex-col lg:flex-row min-h-full w-full overflow-hidden py-4 space-y-8`}
      >
        <div className="w-full">{children}</div>
      </main>
      <Toaster />
    </>
  );
};

export default DriveLayout;
