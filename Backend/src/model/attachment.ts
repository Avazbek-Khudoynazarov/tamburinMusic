export interface Attachment {
  id?: number;
  entity_type: string;
  entity_id: number;
  file: string;
  file_original: string;
  file_size: number;
  created_date?: Date;
}