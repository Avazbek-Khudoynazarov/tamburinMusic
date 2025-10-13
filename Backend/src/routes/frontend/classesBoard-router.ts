import { Router, Request, Response } from 'express';
import { verifyToken } from '../../authorization';
import { ClassesBoardService } from '../../services/classesBoard-service';
import { ClassesBoard } from '../../model/classesBoard';

const router = Router();


// router.use('/list', verifyToken);

// 전체 목록
router.get('/list/all', async (request: Request, response: Response) => {
	const classesBoardService = new ClassesBoardService();

	try {
		const payments_id: number = parseInt(request.query.payments_id as string);
		const member_id: number = parseInt(request.query.member_id as string);
		const teacher_id: number = parseInt(request.query.teacher_id as string);
		let classesBoardList;


		if(payments_id) {
			classesBoardList = await classesBoardService.findByPaymentsId(payments_id);
		}

		else if(member_id && teacher_id) {
			classesBoardList = await classesBoardService.findByMemberIdTeacherId(member_id, teacher_id);
		}
		
		else {
			classesBoardList = await classesBoardService.findAll();
		}

		response.status(200).send(classesBoardList);
	} catch (err) {
		response.status(400).send('manage classesBoard list error');
	}
});

// 페이지네이션 목록
router.get('/list', async (request: Request, response: Response) => {
	const classesBoardService = new ClassesBoardService();

	try {
		const page: number = parseInt(request.query.page as string);
		const classesBoardList: ClassesBoard[] = await classesBoardService.findWithPagination('', page, 20);
		response.status(200).send(classesBoardList);
	} catch (err) {
		response.status(400).send('manage classesBoard list error');
	}
});


// router.use('/get', verifyToken);
router.get('/get', async (request: Request, response: Response) => {
	const classesBoardService = new ClassesBoardService();

	try {
		const id: number = parseInt(request.query.id as string);
		const classesBoard: ClassesBoard | undefined = await classesBoardService.findById(id);
		response.status(200).send(classesBoard);
	} catch (err) {
		response.status(400).send('manage classesBoard list error');
	}
});

// router.use('/create', verifyToken);
router.post('/create', async (request: Request, response: Response) => {
	const classesBoardService = new ClassesBoardService();

	try {
		
		const classesBoard: ClassesBoard = request.body.classesBoard;
		let result = await classesBoardService.create(classesBoard);
		if (!result) {
			response.status(400).send('manage create classesBoard data error');
			return;
		}

		response.status(200).json(result);
	} catch (err) {
		response.status(400).send('manage classesBoard update error');
	}
});

// router.use('/update', verifyToken);
router.put('/update', async (request: Request, response: Response) => {
	const classesBoardService = new ClassesBoardService();

	try {
		
		const classesBoard: ClassesBoard = request.body.classesBoard;
		let result = await classesBoardService.update(classesBoard.id!, classesBoard);
		if (!result) {
			response.status(400).send('manage not exist classesBoard data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage classesBoard update error');
	}
});

// router.use('/delete', verifyToken);
router.delete('/delete', async (request: Request, response: Response) => {
	const classesBoardService = new ClassesBoardService();

	try {
		
		const deleteId: number = parseInt(request.query.id as string);
		let result = await classesBoardService.delete(deleteId);
		if (!result) {
			response.status(400).send('manage not exist classesBoard data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage classesBoard delete error');
	}
});

export default router;