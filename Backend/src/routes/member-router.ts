import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import axios from 'axios';
import Logger from '../loaders/logger';

import { verifyToken } from '../authorization';
import { MemberService } from '../services/member-service';
import { Member } from '../model/member';
import { LiveChatService } from '../services/liveChat-service';
import { LiveChat } from '../model/liveChat';

import config from '../config';

const router = Router();

//유저 채팅 내용 저장.
router.use('/chat', verifyToken);
router.post('/chat', async (request: Request, response: Response) => {
	const liveChatService = new LiveChatService();

	try {
		const memberId: number = response.locals['id'];
		const targetType: string = request.body.targetType as string;
		const targetMemberId: number = parseInt(request.body.targetMemberId as string);
		const message: string = request.body.message as string;

		//타겟이 학생이라면 보내는 사람은 선생님이 된다.
		const liveChat: LiveChat = {
			member_id: targetType === 'member' ? targetMemberId : memberId,
			teacher_id: targetType === 'member' ? memberId : targetMemberId,
			sender_id: memberId,
			content: message,
			created_date: new Date()
		};
		await liveChatService.create(liveChat);

		response.status(200).json({
			type: 'success',
		});
	} catch (err) {
		response.status(400).send('chat error');
	}
});

//유저 채팅 내용 조회.
router.use('/chatList', verifyToken);
router.get('/chatList', async (request: Request, response: Response) => {
	const memberService = new MemberService();
	const liveChatService = new LiveChatService();

	try {
		const memberId: number = response.locals['id'];
		const targetMemberId: number = parseInt(request.query.target_member_id as string);

		//조회하는 계정이 정상적인 계정인지 체크.
		const member: Member | undefined = await memberService.findUserById(memberId);
		if (member === undefined) {
			response.status(200).json({
				type: 'error',
				liveChatList: []
			});
			return;
		}

		let liveChatList: LiveChat[] = [];
		if (member.type == 10) { //학생.
			liveChatList = await liveChatService.findByMemberId(memberId, targetMemberId);
		} else { //강사.
			liveChatList = await liveChatService.findByMemberId(targetMemberId, memberId);
		}

		response.status(200).json({
			type: 'success',
			liveChatList: liveChatList
		});
	} catch (err) {
		response.status(400).send('chatList error');
	}
});

//유저 아이디 중복 확인.
router.get('/checkDuplicateUserId', async (request: Request, response: Response) => {
	const memberService = new MemberService();

	try {
		const user_id: string = request.query.user_id as string;

		const memberData: Member | undefined = await memberService.findUserByUserId(user_id);
		response.status(200).send(memberData != null);
	} catch (err) {
		response.status(400).send('checkDuplicateUserId Error');
	}
});

//유저 가입 요청.
router.post('/register', async (request: Request, response: Response) => {
	const memberService = new MemberService();
	// const cryptedPassword = crypto.createHash('sha512').update(request.body.member.password).digest('base64');
	const cryptedPassword = crypto.createHash('md5').update(request.body.member.password).digest('hex');

	try {
		const createData: Member = {
			type: request.body.member.type,
			user_id: request.body.member.user_id,
			password: cryptedPassword,
			login_type: request.body.member.login_type,
			login_ci_data: request.body.member.login_ci_data,
			name: request.body.member.name,
			nickname: request.body.member.nickname,
			cellphone: request.body.member.cellphone,
			image_file: request.body.member.image_file,
			address1: request.body.member.address1,
			address2: request.body.member.address2,
			address3: request.body.member.address3,
			zip: request.body.member.zip,
			foreign_address: request.body.member.foreign_address,
			gender: request.body.member.gender,
			school_name: request.body.member.school_name,
			grade: request.body.member.grade,
			memo: request.body.member.memo,
			zoom_link_url: request.body.member.zoom_link_url,
			voov_link_url: request.body.member.voov_link_url,
			voov_link_exposed_members: request.body.member.voov_link_exposed_members,
			parent_name: request.body.member.parent_name,
			parent_cellphone: request.body.member.parent_cellphone,
			status: request.body.member.status,
			approve_date: new Date(request.body.member.approve_date),
			leave_date: request.body.member.leave_date ? new Date(request.body.member.leave_date) : undefined,
			leave_message: request.body.member.leave_message,
			agree_marketing: request.body.member.agree_marketing,
			notification_type: request.body.member.notification_type,
			registration_source: request.body.member.registration_source,
			last_login: request.body.member.last_login ? new Date(request.body.member.last_login) : undefined,
			created_date: new Date(),
		};
		const member: Member = await memberService.register(createData);

		//유저 정보를 가지고 토큰을 만들어낸다.
		const token = jwt.sign(
			{
				id: member.id,
				type: 'member'
			},
			config.jwtSecretKey!,
			{
				expiresIn: 60 * 60 * 24 * 60 //60day
			}
		);

		response.status(200).json({ type: 'success', member: member, token: token });
	} catch (err) {
		console.log(err);
		response.status(400).json({
			type: 'error',
			token: '',
		});
	}
});

//소셜 로그인 요청.
router.get('/loginBySocial', async (request: Request, response: Response) => {
	const memberService = new MemberService();

	try {
		const type: string = request.query.type as string; //소셜 로그인 타입. (kakao or naver)
		const code: string = request.query.code as string;
		let id: string = '';
		let name: string = '';
		let email: string = '';
		let mobile: string = '';

		const headers = {
			'Authorization': `Bearer ${code}`
		};

		if (type === 'naver') {
			const response = await axios.get('https://openapi.naver.com/v1/nid/me', { headers: headers });
			id = response.data.response.id;
			name = response.data.response.name ?? '';
			email = response.data.response.email ?? '';
			mobile = response.data.response.mobile ?? '';
		} else {
			const response = await axios.get(`https://kapi.kakao.com/v2/user/me`, { headers: headers });
			id = response.data.id;
			name = response.data.name ?? '';
			email = response.data.email ?? '';
			mobile = response.data.mobile ?? '';
		}

		//일치하는 계정이 있는지 체크.
		let member: Member | undefined = await memberService.findUserByCI(id);
		if (member) {

			if (member.status === 20) {
				//유저 정보를 가지고 토큰을 만들어낸다.
				const token = jwt.sign(
					{
						id: member.id,
						type: 'member'
					},
					config.jwtSecretKey!,
					{
						expiresIn: 60 * 60 * 24 * 60 //60day
					}
				);

				response.status(200).json({
					type: 'success',
					member: member,
					token: token
				});

			} else {

				response.status(200).json({
					type: 'register',
					member: member,
				});

			}

		} else {
			const socialType = type == 'kakao' ? '카카오' : '네이버';
			const createData: Member = {
				type: 10,
				user_id: id,
				password: '',
				login_type: socialType,
				login_ci_data: id,
				name: name,
				nickname: '',
				cellphone: mobile,
				image_file: '',
				address1: '',
				address2: '',
				address3: '',
				zip: '',
				foreign_address: '',
				gender: '',
				school_name: '',
				grade: '',
				memo: '',
				zoom_link_url: '',
				voov_link_url: '',
				voov_link_exposed_members: '',
				parent_name: '',
				parent_cellphone: '',
				status: 10,
				//approve_date: null,
				leave_message: '',
				agree_marketing: '',
				notification_type: '',
				registration_source: '',
				created_date: new Date(),
			};
			member = await memberService.register(createData);

			response.status(200).json({
				type: 'register',
				member: member,
			});
		}


	} catch (err) {
		response.status(400).send('login error');
	}
});

//유저 로그인 요청.
router.get('/login', async (request: Request, response: Response) => {
	const memberService = new MemberService();

	try {
		const type: string = request.query.type as string; //로그인 타입. (teacher or student)
		const user_id: string = request.query.user_id as string;
		const password: string = request.query.password as string;

		// const cryptedPassword = crypto.createHash('sha512').update(password).digest('base64');
		const cryptedPassword = crypto.createHash('md5').update(password).digest('hex');

		//일치하는 메일이 있는지 체크.
		let member: Member | undefined = await memberService.findUserByUserId(user_id);
		if (member === undefined) {
			const log = `login(not): ${user_id} ${password}, ${cryptedPassword}`;
			console.log(log);
			Logger.info(log);
			
			response.status(200).json({
				type: 'error',
				user: null,
				message: '계정이 존재하지 않습니다.'
			});
			return;
		}

		
		// 비밀번호가 없는 경우
		if (member.password == '') {
			const log = `login(reset): ${user_id} ${password}, ${member.password}, ${cryptedPassword}`;
			console.log(log);
			Logger.info(log);

			response.status(200).json({
				type: 'password',
				user: null,
				message: '비밀번호를 재설정 해주세요.'
			});
			return;
		}

		//비밀번호가 일치하는지 확인.
		if (member.password !== cryptedPassword) {
			const log = `login(wrong): ${user_id} ${password}, ${member.password}, ${cryptedPassword}`;
			console.log(log);
			Logger.info(log);
			
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
				id: member.id,
				type: 'member'
			},
			config.jwtSecretKey!,
			{
				expiresIn: 60 * 60 * 24 * 60 //60day
			}
		);

		response.status(200).json({
			type: 'success',
			member: member,
			token: token
		});
	} catch (err) {
		response.status(400).send('login error');
	}
});

// 강제 로그인
router.get('/adminLogin', async (request: Request, response: Response) => {
	const memberService = new MemberService();

	try {
		const type: string = request.query.type as string; //로그인 타입. (teacher or student)
		const user_id: string = request.query.user_id as string;

		//일치하는 메일이 있는지 체크.
		let member: Member | undefined = await memberService.findUserByUserId(user_id);
		if (member === undefined) {
			response.status(200).json({
				type: 'error',
				user: null,
				message: '계정이 존재하지 않습니다.'
			});
			return;
		}


		//유저 정보를 가지고 토큰을 만들어낸다.
		const token = jwt.sign(
			{
				id: member.id,
				type: 'member'
			},
			config.jwtSecretKey!,
			{
				expiresIn: 60 * 60 * 24 * 60 //60day
			}
		);

		response.status(200).json({
			type: 'success',
			member: member,
			token: token
		});
	} catch (err) {
		response.status(400).send('login error');
	}
});

//유저 삭제 요청.(탈퇴)
router.use('/delete', verifyToken);
router.delete('/delete', async (request: Request, response: Response) => {
	const memberService = new MemberService();

	try {
		let userId: number = response.locals['id'];

		let deleteUser = await memberService.delete(userId);
		if (deleteUser) {
			response.status(400).send('not exist user data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('user delete error');
	}
});

export default router;