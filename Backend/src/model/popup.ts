export interface Popup {
  id?: number;
  name: string;
  content: string;
  button_label: string;
  link_url: string;
  image_file: string;
  start_date?: Date | null;
  end_date?: Date | null;
  is_active: string;
  is_deleted: string;
  created_date?: Date;
}