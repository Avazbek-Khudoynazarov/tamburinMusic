export interface Admin {
    id?: number;
    admin_id: string;
    password: string;
    name: string;
    cellphone: string; //휴대폰번호.
    created_date: Date; //가입 날짜.
}