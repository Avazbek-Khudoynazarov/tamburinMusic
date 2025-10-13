import { Router, Request, Response } from 'express';
import crypto from 'crypto';

import { verifyToken } from '../../authorization';
import { MemberService } from '../../services/member-service';
import { Member } from '../../model/member';

const router = Router();


// router.use('/list', verifyToken);

// 전체 유저 목록
router.get('/list/all', async (request: Request, response: Response) => {
	const memberService = new MemberService();

	try {
		const type: number = parseInt(request.query.type as string);
		const cellphone: string = request.query.cellphone as string;
		// const userId: string = request.query.userId as string;
		// const name: string = request.query.name as string;
		
		let memberList;
		// if (userId && name && cellphone) {
		// 	memberList = await memberService.findByInfo(userId, name, cellphone);
		// } else 
		
		if (type) {
			memberList = await memberService.findTypeAll(Number(type));
		} else if (cellphone) {
			memberList = await memberService.findCellphone(cellphone);
		} else {
			memberList = await memberService.findAll();
		}

		response.status(200).send(memberList);
	} catch (err) {
		response.status(400).send('manage member list error');
	}
});

//유저 목록
router.get('/list', async (request: Request, response: Response) => {
	const memberService = new MemberService();

	try {
		const page: number = parseInt(request.query.page as string);
		const memberList: Member[] = await memberService.find(page, 20);
		response.status(200).send(memberList);
	} catch (err) {
		response.status(400).send('manage member list error');
	}
});


// router.use('/get', verifyToken);
router.get('/get', async (request: Request, response: Response) => {
	const memberService = new MemberService();

	try {
		const id: number = parseInt(request.query.id as string);
		const member: Member | undefined = await memberService.findUserById(id);
		response.status(200).send(member);
	} catch (err) {
		response.status(400).send('manage member list error');
	}
});

// router.use('/get', verifyToken);
router.get('/isEmailDuplicate', async (request: Request, response: Response) => {
	const memberService = new MemberService();

	try {
		const user_id: string = request.query.user_id as string;
		const member: Member | undefined = await memberService.findUserByUserId(user_id);


		if (member) {
			response.status(200).json({
				type: 'error'
			});
		} else {
			response.status(200).json({
				type: 'success'
			});
		}
	} catch (err) {
		response.status(400).send('manage member list error');
	}
});



//유저 생성.
// router.use('/create', verifyToken);
router.post('/create', async (request: Request, response: Response) => {
	const memberService = new MemberService();

	try {

		const member: Member = request.body.member;
		member.approve_date = new Date();
		member.created_date = new Date();
		let result = await memberService.register(member);
		if (!result) {
			response.status(400).send('manage create member data error');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage member update error');
	}
});

//유저 업데이트.
// router.use('/update', verifyToken);
router.put('/update', async (request: Request, response: Response) => {
	const memberService = new MemberService();

	try {

		const member: Member = request.body.member;
		// if (member && member.password) {
		// 	// member.password = crypto.createHash('sha512').update(request.body.member.password).digest('base64');
		// 	member.password = crypto.createHash('md5').update(request.body.member.password).digest('hex');
		// }
		let result = await memberService.update(member.id!, member);
		if (!result) {
			response.status(400).send('manage not exist member data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage member update error');
	}
});

router.put('/updatePassword', async (request: Request, response: Response) => {
	const memberService = new MemberService();

	try {

		const user_id: string = request.body.user_id;
		let password: string = request.body.password;


		if (password) {
			// password = crypto.createHash('sha512').update(password).digest('base64');
			password = crypto.createHash('md5').update(password).digest('hex');
		}

		let result = await memberService.updatePassword(user_id, password);
		if (!result) {
			response.status(400).send('manage not exist member data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage member update error');
	}
});

//유저 삭제.
// router.use('/delete', verifyToken);
router.delete('/delete', async (request: Request, response: Response) => {
	const memberService = new MemberService();

	try {

		const deleteId: number = parseInt(request.query.id as string);
		let result = await memberService.delete(deleteId);
		if (!result) {
			response.status(400).send('manage not exist member data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage member delete error');
	}
});

export default router;