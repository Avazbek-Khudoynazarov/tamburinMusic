import { Member } from './member';
import { Instrument } from './instrument';
import { Curriculum } from './curriculum';

export interface ClassesBoard {
  id?: number;
  member_id: number;
  payments_id: number;
  classes_id: number;
  subject: string;
  content?: string;
  is_deleted: string;
  reply_count: number;
  viewed_date?: Date | null;
  created_date: Date;
	member?:Member;
	teacher?:Member;
	student?:Member;
	instrument?:Instrument;
	curriculum?:Curriculum;
}