'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthTabs } from './auth-tabs';
import { SignInForm } from './signin-form';
import { SignUpForm } from './signup-form';
import { SocialAuth } from './social-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ShieldCheckIcon, TicketIcon, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  
  const portalType = searchParams.get('type') || 'customer';
  const redirectPath = searchParams.get('redirect') || `/${portalType}`;

  return (
    <>
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="space-y-3">
          <div className="flex justify-center mb-2">
            {portalType === 'admin' ? (
              <ShieldCheckIcon className="h-12 w-12 text-primary" />
            ) : (
              <TicketIcon className="h-12 w-12 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {portalType === 'admin' ? 'Admin Portal' : 'Customer Portal'}
          </CardTitle>
          <CardDescription className="text-center">
            {portalType === 'admin' 
              ? 'Access the admin dashboard to manage support tickets'
              : 'Sign in to manage your support tickets and get help'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="space-y-6">
            <AuthTabs />
            
            <TabsContent value="signin">
              <SignInForm 
                loading={loading} 
                setLoading={setLoading} 
                portalType={portalType}
                redirectPath={redirectPath}
              />
            </TabsContent>

            <TabsContent value="signup">
              <SignUpForm 
                loading={loading} 
                setLoading={setLoading} 
                portalType={portalType}
                redirectPath={redirectPath}
              />
            </TabsContent>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <SocialAuth portalType={portalType} />
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}