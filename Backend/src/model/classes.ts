import { Member } from './member';
import { Instrument } from './instrument';
import { Payments } from './payments';

export interface Classes {
    id?: number;
    member_id: number; //회원 일련번호.
    payments_id: number; //결제 일련번호.
    status: number; //수업 여부(10 : 수업전, 20 : 수업완료, 30 : 수업불참)
    classes_date: Date; //수업 일시.
    created_date: Date; //등록 일시.
    member?: Member;
    instrument?: Instrument;
    payments?: Payments;
    teacher?: Member;
}