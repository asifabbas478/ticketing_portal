"use client";

import { TicketIcon, ShieldCheckIcon } from 'lucide-react';
import { PortalCard } from '@/components/portal-card';

export function HomeContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Welcome to Support Desk
          </h1>
          <p className="text-xl text-muted-foreground">
            Professional ticketing system for seamless customer support
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PortalCard
            title="Customer Portal"
            description="Submit and track support tickets, access knowledge base, and get help"
            icon={TicketIcon}
            href="/auth?type=customer&redirect=/customer"
            buttonText="Access Portal"
          />

          <PortalCard
            title="Admin Dashboard"
            description="Manage tickets, monitor performance, and handle customer support"
            icon={ShieldCheckIcon}
            href="/auth?type=admin&redirect=/admin"
            buttonText="Access Dashboard"
          />
        </div>

        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>Choose your portal to continue. All communications are secure and encrypted.</p>
        </div>
      </div>
    </div>
  );
}