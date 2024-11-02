'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export default function CustomerLayout({
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
        router.push('/auth?redirect=/customer/tickets');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role !== 'customer') {
        await supabase.auth.signOut();
        router.push('/auth?type=customer');
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