export type MemberFilters = {
  name: string;
  role: string[];
  status: string;
};

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
  zoom_link_url: string; // (강사일 경우)
  voov_link_url: string; // (강사일 경우)
  voov_link_exposed_members: string; // (강사일 경우) voov_link_url을 보여주고자 하는 member 테이블의 user_id 목록이며, 여기 등록되면 zoom_link_url은 보여지지 않음.
  parent_name: string;
  parent_cellphone: string;
  status: number; // 0 (미승인), 1 (승인), 2 (휴면), 3 (탈퇴)
  approve_date: Date;
  leave_date: Date;
  leave_message: string;
  agree_marketing: string;
  notification_type: string;
  registration_source: string;
  last_login: Date;
  created_date: Date;
}
