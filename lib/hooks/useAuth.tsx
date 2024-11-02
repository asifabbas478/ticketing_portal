// lib/hooks/useAuth.tsx
'use client';

import { useContext } from 'react';
import { AuthContext } from '../providers/auth-provider';

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}