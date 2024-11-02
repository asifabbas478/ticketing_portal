'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Ticket } from '@/types/cafm';
import { formatDistanceToNow } from 'date-fns';
import { TICKET_STATUSES } from '@/lib/utils/constants';
import { SearchIcon, PlusIcon, ArrowRightIcon, InboxIcon } from 'lucide-react';
import { AddTicketForm } from '@/components/tickets/add-ticket-form';

interface TicketListProps {
  tickets: Ticket[];
}

export function TicketList({ tickets }: TicketListProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredTickets = tickets.filter((ticket) => 
    ticket.title.toLowerCase().includes(search.toLowerCase()) ||
    ticket.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 rounded-lg border">
        <div className="flex-1 w-full sm:w-auto relative">
          <Input
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm pl-10"
          />
          <SearchIcon className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
        </div>
        <AddTicketForm />
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40%]">Title</TableHead>
              <TableHead className="w-[15%]">Status</TableHead>
              <TableHead className="w-[15%]">Priority</TableHead>
              <TableHead className="w-[20%]">Last Updated</TableHead>
              <TableHead className="w-[10%] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow 
                key={ticket.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => router.push(`/customer/tickets/${ticket.id}`)}
              >
                <TableCell className="font-medium">{ticket.title}</TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className={`${TICKET_STATUSES[ticket.status].color} px-2 py-0.5`}
                  >
                    {TICKET_STATUSES[ticket.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-primary/10 hover:text-primary"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click when clicking button
                      router.push(`/customer/tickets/${ticket.id}`);
                    }}
                  >
                    <ArrowRightIcon className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredTickets.length === 0 && (
              <TableRow>
                <TableCell 
                  colSpan={5} 
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <InboxIcon className="h-8 w-8 text-muted-foreground/60" />
                    <p>No tickets found</p>
                    {search && (
                      <p className="text-sm text-muted-foreground/60">
                        Try adjusting your search query
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}