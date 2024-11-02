'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Clock, User } from 'lucide-react';
import { Ticket } from '@/types/cafm';
import { supabase } from '@/lib/supabase/client';
import { TICKET_STATUSES } from '@/lib/utils/constants';
import { formatDistanceToNow } from 'date-fns';

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTicket() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/auth?redirect=/customer/tickets');
          return;
        }

        const { data, error } = await supabase
          .from('tickets')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Ticket not found');

        setTicket(data as Ticket);
      } catch (error) {
        console.error('Error loading ticket:', error);
        router.push('/customer/tickets');
      } finally {
        setLoading(false);
      }
    }

    loadTicket();
  }, [params.id, router]);

  if (loading) {
    return <TicketDetailSkeleton />;
  }

  if (!ticket) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/customer/tickets')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tickets
        </Button>
      </div>

      <Card>
        <CardHeader className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{ticket.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Created {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge 
                variant="secondary" 
                className={`${TICKET_STATUSES[ticket.status].color} px-2 py-0.5`}
              >
                {TICKET_STATUSES[ticket.status].label}
              </Badge>
              <Badge 
                variant="outline" 
                className={`
                  ${ticket.priority === 'high' ? 'border-red-500 text-red-500' : 
                    ticket.priority === 'urgent' ? 'border-red-700 text-red-700 font-semibold' :
                    ticket.priority === 'low' ? 'border-green-500 text-green-500' :
                    'border-yellow-500 text-yellow-500'}
                `}
              >
                {ticket.priority}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="whitespace-pre-wrap">{ticket.description}</p>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Ticket Details</h3>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd className="mt-1 text-sm">
                  <Badge 
                    variant="secondary" 
                    className={`${TICKET_STATUSES[ticket.status].color} px-2 py-0.5`}
                  >
                    {TICKET_STATUSES[ticket.status].label}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Priority</dt>
                <dd className="mt-1 text-sm">
                  <Badge 
                    variant="outline" 
                    className={`
                      ${ticket.priority === 'high' ? 'border-red-500 text-red-500' : 
                        ticket.priority === 'urgent' ? 'border-red-700 text-red-700 font-semibold' :
                        ticket.priority === 'low' ? 'border-green-500 text-green-500' :
                        'border-yellow-500 text-yellow-500'}
                    `}
                  >
                    {ticket.priority}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                <dd className="mt-1 text-sm">
                  {new Date(ticket.created_at).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                <dd className="mt-1 text-sm">
                  {new Date(ticket.updated_at).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TicketDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-24" />
      </div>

      <Card>
        <CardHeader className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 