export interface Member {
  id?: number;
  type: number;
  user_id: string;
  password: string;
  login_type: string;
  login_ci_data: string;
  name: string;
  nickname: string;
  cellphone: string;
  image_file: string;
  address1: string;
  address2: string;
  address3: string;
  zip: string;
  foreign_address: string;
  gender: string; // 'male' or 'female'
  school_name: string;
  grade: string;
  memo: string;
  zoom_link_url: string;
  voov_link_url: string;
  voov_link_exposed_members: string;
  parent_name: string;
  parent_cellphone: string;
  status: number;
  approve_date?: Date;
  leave_date?: Date;
  leave_message: string;
  agree_marketing: string;
  notification_type: string;
  registration_source: string;
  last_login?: Date;
  created_date: Date;
}