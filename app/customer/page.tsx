'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClientSupabaseClient } from '@/lib/supabase/client';

export default function CustomerPortal() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth?redirect=/customer');
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setProfile(data);
      setLoading(false);
    }

    loadProfile();
  }, [router, supabase]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Customer Portal</CardTitle>
          <CardDescription>
            Welcome back, {profile?.full_name || profile?.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Your support tickets will appear here.</p>
        </CardContent>
      </Card>
    </main>
  );
}