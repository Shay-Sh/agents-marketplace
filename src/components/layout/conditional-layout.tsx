'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if we're on a dashboard or admin route
  const isDashboardRoute = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');
  
  // For dashboard and admin routes, return children without header/footer
  if (isDashboardRoute) {
    return <>{children}</>;
  }
  
  // For all other routes, return the normal layout with header/footer
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}