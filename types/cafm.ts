export type ModuleCategory = 
  | 'Work Order'
  | 'Asset'
  | 'User Management'
  | 'Performance'
  | 'Dashboard/Reports'
  | 'Inventory'
  | 'Platform Settings';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category_id: string | null;
  created_by: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}