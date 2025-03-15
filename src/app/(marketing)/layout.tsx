import { NavBar } from '@/components/layout/navbar';
import { marketingConfig } from '@/config/marketing';
import { currentUser } from '@/lib/auth';
import { Suspense } from 'react';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const user = await currentUser();

  return (
    <div className="flex min-h-screen bg-card flex-col">
      <Suspense fallback="">
        <NavBar user={user} items={marketingConfig.mainNav} scroll={true} />
      </Suspense>

      <main className="flex-1">{children}</main>
    </div>
  );
}
