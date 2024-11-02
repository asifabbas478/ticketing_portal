"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightIcon } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface PortalCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  buttonText: string;
}

export function PortalCard({ title, description, icon: Icon, href, buttonText }: PortalCardProps) {
  return (
    <Card className="relative group hover:shadow-lg transition-all duration-300">
      <Link href={href}>
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
            <Button variant="ghost" className="group-hover:translate-x-1 transition-transform duration-300">
              {buttonText} <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}