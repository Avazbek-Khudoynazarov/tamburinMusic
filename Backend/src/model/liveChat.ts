export interface LiveChat {
  id?: number;
  member_id: number;
  teacher_id: number;
  sender_id: number;
  content: string;
  created_date?: Date | null;
}