export interface Board {
  id?: number;
  member_id: number;
  type: string;
  category: string;
  subject: string;
  content: string;
  count: number;
  is_active: string;
  is_deleted: string;
  created_date?: Date;
}