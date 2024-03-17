import React from 'react';

interface DriveLayoutProps {
  children?: React.ReactNode;
}

const DriveLayout = async ({ children }: DriveLayoutProps) => {
  return (
    <>
      <main
        className={`flex flex-col lg:flex-row min-h-full w-full overflow-hidden p-4 space-y-8`}
      >
        <div className="w-full">{children}</div>
      </main>
    </>
  );
};

export default DriveLayout;
