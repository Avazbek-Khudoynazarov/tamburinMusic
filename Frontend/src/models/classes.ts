import { Member } from './member';
import { Instrument } from './instrument';
import { Curriculum } from './curriculum';
import { Payments } from './payments';

export interface Classes {
  id: number | undefined;
  member_id: number;
  payments_id: number;
  status: number;
	classes_date?: Date | string | null
  created_date?: Date;
	member?:Member;
	teacher?:Member;
	instrument?:Instrument;
	curriculum?:Curriculum;
	payments?:Payments;
}