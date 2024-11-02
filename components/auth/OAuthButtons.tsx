'use client';

import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function OAuthButtons() {
  const handleGithubSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="grid grid-cols-1 gap-2">
      <Button
        variant="outline"
        type="button"
        onClick={handleGithubSignIn}
        className="w-full"
      >
        <Github className="mr-2 h-4 w-4" />
        Continue with GitHub
      </Button>
    </div>
  );
}