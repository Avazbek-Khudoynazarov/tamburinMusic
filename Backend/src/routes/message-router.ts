import { Router, Request, Response } from 'express';

import { verifyToken } from '../authorization';
import { AligoService } from '../services/aligo-service';
import { EmailService } from '../services/email-service';

import { Email } from '../model/email';

const router = Router();

//이메일 전송
// router.use('/sendmail', verifyToken);
router.post('/sendkakao', async (request: Request, response: Response) => {
	const aligoService = new AligoService();

	try {
		const params: any = request.body.params;
		await aligoService.sendKakao(params);

		response.status(200).json({ type: 'success' });
	} catch (err) {
		response.status(400).json({
			type: 'error',
			token: '',
		});
	}
});


router.post('/sendemail', async (request: Request, response: Response) => {
	const emailService = new EmailService();

	try {
		// const recieverEmail: string = request.body.recieverEmail as string;
		// const type: string = request.body.type as string;
		// await emailService.sendEmail(recieverEmail, type);
		const params: any = request.body.params;
		await emailService.sendEmail(params);

		response.status(200).json({ type: 'success' });
	} catch (err) {
		response.status(400).json({
			type: 'error',
			token: '',
		});
	}
});


router.post('/verificatemail', async (request: Request, response: Response) => {
	const emailService = new EmailService();

	try {
		const user_id: string = request.body.user_id as string;
		const token: string = request.body.token as string;

		const result = await emailService.findByUserId(user_id, token);
		response.status(200).send(result);
	} catch (err) {
		response.status(400).send('error verificate email');
	}
});

router.post('/iscertifyemail', async (request: Request, response: Response) => {
	const emailService = new EmailService();

	try {
		const user_id: string = request.body.user_id as string;
		const token: string = request.body.token as string;
		const status: string = '인증완료';

		const result = await emailService.findByUserIdStatus(user_id, token, status);
		response.status(200).send(result);
	} catch (err) {
		response.status(400).send('error verificate email');
	}
});


router.post('/certifyemail', async (request: Request, response: Response) => {
	const emailService = new EmailService();

	try {
		const data: Email = request.body.data;
		data.status = '인증완료';
		data.verified_at = new Date();
		await emailService.update(data.id!, data);
		
		response.status(200).send();
	} catch (err) {
		response.status(400).send('error certify email');
	}
});


// 테스트용 알림톡 전송 (개발용)
router.get('/test-alimtalk', async (request: Request, response: Response) => {
	const aligoService = new AligoService();

	try {
		const testPhone = '01074794414'; // 테스트용 전화번호
		const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

		console.log('========== TEST ALIMTALK ==========');
		console.log('Sending to:', testPhone);
		console.log('Time:', now);

		await aligoService.sendKakao({
			phone: testPhone,
			code: 'TH_8113',
			content: `[테스트] ${now} 알림톡 테스트 메시지입니다.`
		});

		console.log('Test alimtalk sent successfully!');
		console.log('===================================');

		response.status(200).json({
			type: 'success',
			message: 'Test alimtalk sent!',
			phone: testPhone,
			time: now
		});
	} catch (err) {
		console.error('Test alimtalk error:', err);
		response.status(400).json({
			type: 'error',
			message: String(err),
		});
	}
});

//카카오 알림톡 전송
// router.use('/alimtalk', verifyToken);
router.post('/alimtalk', async (request: Request, response: Response) => {
	const aligoService = new AligoService();

	try {
		const tplCode: string = request.query.tplCode as string;
		const receiverPhone: string = request.query.receiverPhone as string;
		const message: string = request.query.message as string;
		await aligoService.sendAlimTalk(tplCode, receiverPhone, message);
		response.status(200).json({ type: 'success' });
	} catch (err) {
		response.status(400).json({
			type: 'error',
			token: '',
		});
	}
});

export default router;