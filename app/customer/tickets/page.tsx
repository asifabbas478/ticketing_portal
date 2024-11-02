'use client';

import { useEffect, useState } from 'react';
import { TicketList } from '@/components/tickets/ticket-list';
import { Card, CardContent } from '@/components/ui/card';
import { Ticket, TicketStatus, TicketPriority } from '@/types/cafm';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

// Update the interface to match the actual database response
interface TicketRow {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  user_id: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTickets() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) return;

        const { data, error } = await supabase
          .from('tickets')
          .select('*')
          .eq('created_by', session.user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedTickets: Ticket[] = (data as TicketRow[] || []).map(ticket => ({
          id: ticket.id,
          title: ticket.title,
          description: ticket.description,
          status: ticket.status as TicketStatus,
          priority: ticket.priority as TicketPriority,
          category_id: '',
          created_by: ticket.user_id,
          assigned_to: ticket.assigned_to,
          created_at: ticket.created_at,
          updated_at: ticket.updated_at
        }));

        setTickets(formattedTickets);
      } catch (error) {
        console.error('Error loading tickets:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTickets();

    const channel = supabase
      .channel('tickets')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'tickets' 
        }, 
        () => {
          loadTickets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Support Tickets</h1>
          <p className="text-muted-foreground">
            View and manage your CAFM support tickets
          </p>
        </div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <TicketList tickets={tickets} />
        </CardContent>
      </Card>
    </div>
  );
}