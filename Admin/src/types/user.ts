import type { IDateValue, ISocialLink, IDatePickerControl } from './common';

// ----------------------------------------------------------------------

export type IUserTableFilters = {
  searchType: string;
  searchKeyword: string;
  roleType: string[];
  roleMarketing: string[];
  status: string;
  startDate: IDatePickerControl;
  endDate: IDatePickerControl;
};


export type ITableFilters = {
	roleCheck1: string[];
  roleCheck2: string[];
  roleKeyword: string;
  searchKeyword: string;
  status: string;
  startDate: IDatePickerControl;
  endDate: IDatePickerControl;
};

export type IUserProfileCover = {
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
};

export type IUserProfile = {
  id: string;
  role: string;
  quote: string;
  email: string;
  school: string;
  country: string;
  company: string;
  totalFollowers: number;
  totalFollowing: number;
  socialLinks: ISocialLink;
};

export type IUserProfileFollower = {
  id: string;
  name: string;
  country: string;
  avatarUrl: string;
};

export type IUserProfileGallery = {
  id: string;
  title: string;
  imageUrl: string;
  postedAt: IDateValue;
};

export type IUserProfileFriend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IUserProfilePost = {
  id: string;
  media: string;
  message: string;
  createdAt: IDateValue;
  personLikes: { name: string; avatarUrl: string }[];
  comments: {
    id: string;
    message: string;
    createdAt: IDateValue;
    author: { id: string; name: string; avatarUrl: string };
  }[];
};

export type IUserCard = {
  id: string;
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
};


export type IUserAccount = {
  city: string;
  email: string;
  state: string;
  about: string;
  address: string;
  zipCode: string;
  isPublic: boolean;
  displayName: string;
  phoneNumber: string;
  country: string | null;
  photoURL: File | string | null;
};

export type IUserAccountBillingHistory = {
  id: string;
  price: number;
  invoiceNumber: string;
  createdAt: IDateValue;
};


export type IUserItem = {
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
  leave_date: Date | undefined;
  leave_message: string;
  agree_marketing: string;
  notification_type: string;
  registration_source: string;
  last_login: Date | undefined;
  created_date: Date;

  /*
  id: string;
  name: string;
  city: string;
  role: string;
  email: string;
  state: string;
  status: string;
  address: string;
  country: string;
  zipCode: string;
  company: string;
  avatarUrl: string;
  phoneNumber: string;
  isVerified: boolean;
  */
};











// 첨부파일
export type IAttachmentItem = {
  id?: number;
  entity_type: string;
  entity_id: number;
  file: string;
  file_original: string;
  file_size: number;
  created_date?: Date;
	deleted?: boolean;
};


// 배너
export type IBannerItem = {
  id?: number;
  entity_type: string;
  image_file: string;
  link_url: string;
  additional_text: string;
  created_date?: Date;
};

// 게시판
export type IBoardItem = {
  id?: number;
  admin_id?: number;
  member_id?: number;
  type: string;
  category?: string;
  subject: string;
  content: string;
  count: number;
  is_active: string;
  is_deleted: string;
  created_by_type: string;
  created_date: Date;
	writer_name?: string;
	writer_id?: string;
};

// 게시판 댓글
export type IBoardReplyItem = {
  id?: number;
  board_id: number;
  member_id: number;
  content: string;
  is_deleted: string;
  created_date?: Date;
};

// 수업
export type IClassesItem = {
  id: number | undefined;
  member_id: number;
  payments_id: number;
  status: number;
	classes_date?: Date | string | null
  created_date?: Date;
	member?:IMemberItem;
	teacher?:IMemberItem;
	instrument?:IInstrumentItem;
	curriculum?:ICurriculumItem;
	payments?:IPaymentsItem;
};

// 수업게시판
export type IClassesBoardItem = {
  id?: number;
  member_id: number;
  payments_id: number;
  classes_id: number;
  subject: string;
  content?: string;
  is_deleted: string;
  reply_count: number;
  viewed_date?: Date | null;
  created_date: Date;
	member?:IMemberItem;
	teacher?:IMemberItem;
	student?:IMemberItem;
	instrument?:IInstrumentItem;
	curriculum?:ICurriculumItem;
};

// 수업게시판 댓글
export type IClassesBoardReplyItem = {
  id: number;
  classes_id: number;
  classes_board_id: number;
  member_id: number;
  content: string;
  is_deleted: string;
  created_date?: Date;
	member?:IMemberItem;
};



// 커리큘럼
export type ICurriculumItem = {
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
	instrument?:IInstrumentItem;
}





// 악기
export type IInstrumentItem = {
  id?: number;
  name: string;
  image_file1?: string;
  image_file2?: string;
  display_order: number;
  is_deleted: string;
  created_date: Date;
}





// 실시간 대화
export type ILiveChatItem = {
  id?: number;
  member_id: number;
  payments_id: number;
  content: string;
  created_date?: Date | null;
};




// 회원
export type IMemberItem = {
  id?: number;
  type: number;
  user_id: string;
  password: string;
  login_type?: string;
  login_ci_data?: string;
  name: string;
  nickname?: string;
  cellphone: string;
  image_file?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  zip?: string;
  foreign_address?: string;
  gender: string;
  school_name?: string;
  grade?: string;
  memo?: string;
  zoom_link_url?: string;
  voov_link_url?: string;
  voov_link_exposed_members?: string;
  parent_name?: string;
  parent_cellphone?: string;
  total_payments?: number;
  total_price?: number;
  remaining_classes?: number;
  status: number;
  approve_date?: Date;
  leave_date?: Date | undefined;
  leave_message?: string;
  agree_marketing: string;
  notification_type: string;
  registration_source: string;
  last_login?: Date | undefined;
  created_date: Date;
};

// 메타
export type IMetaItem = {
  id?: number;
  entity_type: string;
  entity_id: string;
  entity_value: string;
  created_date?: Date | null;
	value?: string;
};


// 결제
export type IPaymentsItem = {
  id?: number;
  member_id: number;
  teacher_id?: number;
  instrument_id: number;
  curriculum_id: number;
  total_classes?: number;
  remaining_classes?: number;
  instrument_option: number;
  delivery_address?: string;
  available_time?: string;
  memo?: string;
  teacher_memo?: string;
  classes_price: number;
  instrument_price: number;
  classes_link?: string;
  monthly_price: number;
  final_price: number;
  payment_type: number;
  periodic_payment: number;
  billing_key?: string;
  payment_method?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_holder?: string;
  status: number;
  periodic_status?: string;
  payment_date?: Date | null;
  pg_pay_no?: string;
  error_log?: string;
  is_deleted: string;
  created_date?: Date;
	member?:IMemberItem;
	teacher?:IMemberItem;
	instrument?:IInstrumentItem;
	curriculum?:ICurriculumItem;
};


// 정기결제
export type IPeriodicPaymentsItem = {
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


// 팝업
export type IPopupItem = {
  id?: number;
  name: string;
  content?: string;
  button_label?: string;
  link_url?: string;
  image_file?: string;
  start_date?: Date | string | null;
  end_date?: Date | string | null;
  is_active: string;
  is_deleted: string;
  created_date: Date;
};


