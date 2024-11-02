'use client';

import { AuthForm } from '@/components/auth/auth-form';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
      <AuthForm />
    </div>
  );
}