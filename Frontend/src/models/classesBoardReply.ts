import { Member } from './member';

export interface ClassesBoardReply {
  id: number;
  classes_id: number;
  classes_board_id: number;
  member_id: number;
  content: string;
  is_deleted: string;
  created_date?: Date;
	member?:Member;
};