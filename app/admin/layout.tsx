'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientSupabaseClient } from '@/lib/supabase/client';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth?redirect=/admin');
      }
    };

    checkAuth();
  }, [router, supabase.auth]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
}