export interface Board {
  id?: number;
  admin_id?: number;
  member_id?: number;
  type: string;
  category?: string;
  subject: string;
  content: string;
  count: number;
  is_active: string;
  is_deleted: string;
  created_by_type: string;
  created_date: Date;
	writer_name?: string;
	writer_id?: string;
}