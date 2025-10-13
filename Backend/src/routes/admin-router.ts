import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { verifyToken } from '../authorization';
import { AdminService } from '../services/admin-service';
import { Admin } from '../model/admin';

import config from '../config';
import { Global } from '../global';

const router = Router();

//관리자 계정 생성.
router.post('/register', async (request: Request, response: Response) => {
    const adminService = new AdminService();
    // const cryptedPassword = crypto.createHash('sha512').update(request.body.password).digest('base64');
		const cryptedPassword = crypto.createHash('md5').update(request.body.password).digest('hex');

    try{
        const createData: Admin = {
            admin_id: request.body.admin_id,
            password: cryptedPassword,
            name: request.body.name,
            cellphone: request.body.cellphone,
            created_date: new Date(),
        };
        const admin: Admin = await adminService.register(createData);

        response.status(200).json({type: 'success', admin: admin});
    }catch(err) {
        response.status(400).json({
            type: 'error',
            token: '',
        });
    }
});

//관리자 로그인 요청.
router.get('/login', async (request: Request, response: Response) => {
    const adminService = new AdminService();

    try{
        const admin_id: string = request.query.admin_id as string;
        const password: string = request.query.password as string;
        // const cryptedPassword = crypto.createHash('sha512').update(password).digest('base64');
				const cryptedPassword = crypto.createHash('md5').update(password).digest('hex');
				
        //일치하는 메일이 있는지 체크.
        const admin: Admin | undefined = await adminService.findAdminById(admin_id);
        if(admin === undefined) {
            response.status(200).json({
                type: 'error', 
                user: null, 
                message: '계정이 존재하지 않습니다.'
            });
            return;
        }

        //비밀번호가 일치하는지 확인.
        if(admin.password !== cryptedPassword) {
            response.status(200).json({
                type: 'error', 
                user: null, 
                message: '비밀번호가 틀렸습니다.'
            });
            return;
        }

        //유저 정보를 가지고 토큰을 만들어낸다.
        const token = jwt.sign(
            {
                id: admin.id,
                type: 'admin'
            },
            config.jwtSecretKey!,
            {
                expiresIn: 60 * 60 * 24 * 60 //60day
            }
        );

        response.status(200).json({
            type: 'success', 
            admin: admin, 
            token: token
        });
    }catch(err) {
        response.status(400).send('login error');
    }
});

export default router;