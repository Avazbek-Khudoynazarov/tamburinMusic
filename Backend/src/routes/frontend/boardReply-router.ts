import { Router, Request, Response } from 'express';
import { verifyToken } from '../../authorization';
import { BoardReplyService } from '../../services/boardReply-service';
import { BoardReply } from '../../model/boardReply';

const router = Router();


// router.use('/list', verifyToken);

// 전체 목록
router.get('/list/all', async (request: Request, response: Response) => {
	const boardreplyService = new BoardReplyService();

	try {
		const boardreplyList = await boardreplyService.findAll();

		response.status(200).send(boardreplyList);
	} catch (err) {
		response.status(400).send('manage boardreply list error');
	}
});

// 페이지네이션 목록
router.get('/list', async (request: Request, response: Response) => {
	const boardreplyService = new BoardReplyService();

	try {
		const page: number = parseInt(request.query.page as string);
		const boardreplyList: BoardReply[] = await boardreplyService.findWithPagination('', page, 20);
		response.status(200).send(boardreplyList);
	} catch (err) {
		response.status(400).send('manage boardreply list error');
	}
});


// router.use('/get', verifyToken);
router.get('/get', async (request: Request, response: Response) => {
	const boardreplyService = new BoardReplyService();

	try {
		const id: number = parseInt(request.query.id as string);
		const boardreply: BoardReply | undefined = await boardreplyService.findById(id);
		response.status(200).send(boardreply);
	} catch (err) {
		response.status(400).send('manage boardreply list error');
	}
});

// router.use('/create', verifyToken);
router.post('/create', async (request: Request, response: Response) => {
	const boardreplyService = new BoardReplyService();

	try {
		
		const boardreply: BoardReply = request.body.boardreply;
		let result = await boardreplyService.create(boardreply);
		if (!result) {
			response.status(400).send('manage create boardreply data error');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage boardreply update error');
	}
});

// router.use('/update', verifyToken);
router.put('/update', async (request: Request, response: Response) => {
	const boardreplyService = new BoardReplyService();

	try {
		
		const boardreply: BoardReply = request.body.boardreply;
		let result = await boardreplyService.update(boardreply.id!, boardreply);
		if (!result) {
			response.status(400).send('manage not exist boardreply data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage boardreply update error');
	}
});

// router.use('/delete', verifyToken);
router.delete('/delete', async (request: Request, response: Response) => {
	const boardreplyService = new BoardReplyService();

	try {
		
		const deleteId: number = parseInt(request.query.id as string);
		let result = await boardreplyService.delete(deleteId);
		if (!result) {
			response.status(400).send('manage not exist boardreply data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage boardreply delete error');
	}
});

export default router;