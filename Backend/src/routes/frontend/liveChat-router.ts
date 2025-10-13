import { Router, Request, Response } from 'express';
import { verifyToken } from '../../authorization';
import { LiveChatService } from '../../services/liveChat-service';
import { LiveChat } from '../../model/liveChat';

const router = Router();


// router.use('/list', verifyToken);

// 전체 목록
router.get('/list/all', async (request: Request, response: Response) => {
	const livechatService = new LiveChatService();

	try {
		const livechatList = await livechatService.findAll();

		response.status(200).send(livechatList);
	} catch (err) {
		response.status(400).send('manage livechat list error');
	}
});

// 페이지네이션 목록
router.get('/list', async (request: Request, response: Response) => {
	const livechatService = new LiveChatService();

	try {
		const page: number = parseInt(request.query.page as string);
		const livechatList: LiveChat[] = await livechatService.findWithPagination('', page, 20);
		response.status(200).send(livechatList);
	} catch (err) {
		response.status(400).send('manage livechat list error');
	}
});


// router.use('/get', verifyToken);
router.get('/get', async (request: Request, response: Response) => {
	const livechatService = new LiveChatService();

	try {
		const id: number = parseInt(request.query.id as string);
		const livechat: LiveChat | undefined = await livechatService.findById(id);
		response.status(200).send(livechat);
	} catch (err) {
		response.status(400).send('manage livechat list error');
	}
});

// router.use('/create', verifyToken);
router.post('/create', async (request: Request, response: Response) => {
	const livechatService = new LiveChatService();

	try {
		
		const livechat: LiveChat = request.body.livechat;
		let result = await livechatService.create(livechat);
		if (!result) {
			response.status(400).send('manage create livechat data error');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage livechat update error');
	}
});

// router.use('/update', verifyToken);
router.put('/update', async (request: Request, response: Response) => {
	const livechatService = new LiveChatService();

	try {
		
		const livechat: LiveChat = request.body.livechat;
		let result = await livechatService.update(livechat.id!, livechat);
		if (!result) {
			response.status(400).send('manage not exist livechat data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage livechat update error');
	}
});

// router.use('/delete', verifyToken);
router.delete('/delete', async (request: Request, response: Response) => {
	const livechatService = new LiveChatService();

	try {
		
		const deleteId: number = parseInt(request.query.id as string);
		let result = await livechatService.delete(deleteId);
		if (!result) {
			response.status(400).send('manage not exist livechat data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage livechat delete error');
	}
});

export default router;