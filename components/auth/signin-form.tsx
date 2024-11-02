'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from '@/components/ui/use-toast';

interface SignInFormProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  portalType: string;
  redirectPath: string;
}

export function SignInForm({ loading, setLoading, portalType, redirectPath }: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Sign in the user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.session) {
        throw new Error('No session created');
      }

      // 2. Get the user's profile with role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', authData.session.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw new Error('Failed to fetch user profile');
      }

      if (!profile) {
        throw new Error('No profile found');
      }

      // 3. Verify role matches portal type
      if (profile.role !== portalType) {
        await supabase.auth.signOut();
        throw new Error(`Please use the ${profile.role} portal to sign in.`);
      }

      // 4. Show success message
      toast({
        title: "Success",
        description: `Welcome back${profile.full_name ? ', ' + profile.full_name : ''}!`,
      });

      // 5. Redirect based on role
      const redirectTo = profile.role === 'customer' 
        ? '/customer/tickets'
        : '/admin';

      // 6. Use router push for navigation
      console.log('Redirecting to:', redirectTo);
      router.push(redirectTo);

    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      // If there was an error, sign out to be safe
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </Button>
    </form>
  );
}