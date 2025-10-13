export interface Email {
    id?: number;
    user_id: string; 
    token: string; 
    type: string; 
    status: string; 
    remote_ip?: string; 
    created_at: Date;
    expires_at: Date;
    verified_at?: Date;
}