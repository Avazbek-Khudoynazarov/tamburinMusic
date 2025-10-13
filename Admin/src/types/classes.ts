import { IUserItem } from 'src/types/user';

export type IClassesItem = {
    id?: number;
    member_id: number;
    payments_id: number;
    status: number;
    classes_date: Date | string | null
    created_date: Date;

    member?: IUserItem;
}