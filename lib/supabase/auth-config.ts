import { Provider } from '@supabase/supabase-js';

export const OAUTH_PROVIDERS = {
  google: {
    name: 'Google',
    icon: 'google',
  },
  github: {
    name: 'GitHub',
    icon: 'github',
  },
} as const;

export type OAuthProvider = keyof typeof OAUTH_PROVIDERS;

export async function signInWithOAuth(provider: Provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  if (error) throw error;
  return data;
}