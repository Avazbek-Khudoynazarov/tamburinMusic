export interface Banner {
  id?: number;
  entity_type: string;
  image_file: string;
  link_url: string;
  additional_text: string;
  created_date?: Date;
}