import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is signed in and tries to access /auth page, redirect them
  if (session && req.nextUrl.pathname.startsWith('/auth')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    const redirectUrl = new URL(profile?.role === 'admin' ? '/admin' : '/customer/tickets', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is not signed in and tries to access protected routes
  if (!session && (req.nextUrl.pathname.startsWith('/customer') || req.nextUrl.pathname.startsWith('/admin'))) {
    const redirectUrl = new URL('/auth', req.url);
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/auth/:path*', '/customer/:path*', '/admin/:path*'],
};