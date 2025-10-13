import { Instrument } from './instrument';

export interface Curriculum {
  id?: number;
  instrument_id?: number;
  months: number;
  weekly_classes: number;
  total_classes: number;
  name: string;
  price: number;
  instrument_price: number;
  instrument_rental_fee: number;
  instrument_discount: number;
  image_file?: string;
  additional_text?: string;
  is_deleted: string;
  created_date: Date;
	instrument?:Instrument;
	text?: {
    text1?: string;
    text2?: string;
    text3?: string;
  };
}
