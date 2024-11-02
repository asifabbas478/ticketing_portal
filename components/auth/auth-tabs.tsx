'use client';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AuthTabs() {
  return (
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="signin">Sign In</TabsTrigger>
      <TabsTrigger value="signup">Sign Up</TabsTrigger>
    </TabsList>
  );
}