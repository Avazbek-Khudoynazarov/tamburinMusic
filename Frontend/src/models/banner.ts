export interface Banner {
  id?: number;
  entity_type: string;
  image_file: string;
  link_url: string;
  additional_text: string;
  parse_text?: {
		text1?:string;
		text2?:string;
		text3?:string;
		text4?:string;
		text5?:string;
	}
  created_date?: Date;
}