export type User = {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  created_at: string;
};

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  created_by: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: string;
  ticket_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

export type Attachment = {
  id: string;
  ticket_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
};

export type KnowledgeBaseArticle = {
  id: string;
  title: string;
  content: string;
  category_id: string;
  created_at: string;
  updated_at: string;
};