export interface PeriodicPayments {
  id?: number;
  member_id: number;
  payments_id: number;
  price: number;
  status: number;
  error_log?: string;
  payment_date?: Date;
  is_deleted: string;
  created_date?: Date;
};