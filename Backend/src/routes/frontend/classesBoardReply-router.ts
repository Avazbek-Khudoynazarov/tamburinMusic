import { Router, Request, Response } from 'express';
import { verifyToken } from '../../authorization';
import { ClassesBoardReplyService } from '../../services/classesBoardReply-service';
import { ClassesBoardReply } from '../../model/classesBoardReply';

const router = Router();


// router.use('/list', verifyToken);

// 전체 목록
router.get('/list/all', async (request: Request, response: Response) => {
	const classesBoardReplyService = new ClassesBoardReplyService();

	try {
		const classes_board_id: number = parseInt(request.query.classes_board_id as string);
		let classesBoardReplyList;


		if(classes_board_id) {
			classesBoardReplyList = await classesBoardReplyService.findByClassesBoardId(classes_board_id);
		}
		
		else {
			classesBoardReplyList = await classesBoardReplyService.findAll();
		}

		response.status(200).send(classesBoardReplyList);
	} catch (err) {
		response.status(400).send('manage classesBoardReply list error');
	}
});

// 페이지네이션 목록
router.get('/list', async (request: Request, response: Response) => {
	const classesBoardReplyService = new ClassesBoardReplyService();

	try {
		const page: number = parseInt(request.query.page as string);
		const classesBoardReplyList: ClassesBoardReply[] = await classesBoardReplyService.findWithPagination('', page, 20);
		response.status(200).send(classesBoardReplyList);
	} catch (err) {
		response.status(400).send('manage classesBoardReply list error');
	}
});


// router.use('/get', verifyToken);
router.get('/get', async (request: Request, response: Response) => {
	const classesBoardReplyService = new ClassesBoardReplyService();

	try {
		const id: number = parseInt(request.query.id as string);
		const classesBoardReply: ClassesBoardReply | undefined = await classesBoardReplyService.findById(id);
		response.status(200).send(classesBoardReply);
	} catch (err) {
		response.status(400).send('manage classesBoardReply list error');
	}
});

// router.use('/create', verifyToken);
router.post('/create', async (request: Request, response: Response) => {
	const classesBoardReplyService = new ClassesBoardReplyService();

	try {
		
		const classesBoardReply: ClassesBoardReply = request.body.classesBoardReply;
		let result = await classesBoardReplyService.create(classesBoardReply);
		if (!result) {
			response.status(400).send('manage create classesBoardReply data error');
			return;
		}

		response.status(200).json(result);
	} catch (err) {
		response.status(400).send('manage classesBoardReply update error');
	}
});

// router.use('/update', verifyToken);
router.put('/update', async (request: Request, response: Response) => {
	const classesBoardReplyService = new ClassesBoardReplyService();

	try {
		
		const classesBoardReply: ClassesBoardReply = request.body.classesBoardReply;
		let result = await classesBoardReplyService.update(classesBoardReply.id!, classesBoardReply);
		if (!result) {
			response.status(400).send('manage not exist classesBoardReply data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage classesBoardReply update error');
	}
});

// router.use('/delete', verifyToken);
router.delete('/delete', async (request: Request, response: Response) => {
	const classesBoardReplyService = new ClassesBoardReplyService();

	try {
		
		const deleteId: number = parseInt(request.query.id as string);
		let result = await classesBoardReplyService.delete(deleteId);
		if (!result) {
			response.status(400).send('manage not exist classesBoardReply data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage classesBoardReply delete error');
	}
});

export default router;