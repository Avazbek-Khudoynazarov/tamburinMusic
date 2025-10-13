export interface BoardReply {
  id?: number;
  board_id: number;
  member_id: number;
  content: string;
  is_deleted: string;
  created_date?: Date;
}