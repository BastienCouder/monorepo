import { currentRole } from '@/lib/authCheck';
import { cn } from '@/lib/utils';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await currentRole();
  if (!admin) {
    redirect('/');
  }

  return (
    <>
      <html lang="fr">
        <body
          className={cn('min-h-screen bg-background font-sans antialiased')}
        >
          <main className="flex flex-col gap-y-3">{children}</main>
        </body>
      </html>
    </>
  );
}
