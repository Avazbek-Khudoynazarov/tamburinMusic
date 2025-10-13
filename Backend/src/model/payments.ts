import { Curriculum } from './curriculum';

export interface Payments {
  id?: number;
  member_id: number;
  teacher_id: number;
  instrument_id: number;
  curriculum_id: number;
  total_classes: number;
  remaining_classes: number;
  instrument_option: number;
  delivery_address: string;
  available_time: string;
  memo: string;
  teacher_memo: string;
  classes_link: string;
  classes_price: number;
  instrument_price: number;
  monthly_price: number;
  final_price: number;
  payment_type: number;
  periodic_payment: number;
  billing_key: string;
  payment_method: string;
  bank_name: string;
  bank_account_number: string;
  bank_account_holder: string;
  status: number;
  periodic_status: string;
  payment_date?: Date | null;
  pg_pay_no: string;
  error_log: string;
  is_deleted: string;
  created_date?: Date;
	curriculum?:Curriculum;
}