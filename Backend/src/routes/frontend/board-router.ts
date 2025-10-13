import { Router, Request, Response } from 'express';
import { verifyToken } from '../../authorization';
import { BoardService } from '../../services/board-service';
import { Board } from '../../model/board';

const router = Router();


// router.use('/list', verifyToken);

// 전체 목록
router.get('/list/all', async (request: Request, response: Response) => {
	const boardService = new BoardService();

	try {
		const type: string = request.query.type as string;
		let boardList;


		if(type) {
			boardList = await boardService.findByType(type);
		}
		
		else {
			boardList = await boardService.findAll();
		}


		response.status(200).send(boardList);
	} catch (err) {
		response.status(400).send('manage board list error');
	}
});

// 페이지네이션 목록
router.get('/list', async (request: Request, response: Response) => {
	const boardService = new BoardService();

	try {
		const page: number = parseInt(request.query.page as string);
		const boardList: Board[] = await boardService.findWithPagination('', page, 20);
		response.status(200).send(boardList);
	} catch (err) {
		response.status(400).send('manage board list error');
	}
});


// router.use('/get', verifyToken);
router.get('/get', async (request: Request, response: Response) => {
	const boardService = new BoardService();

	try {
		const id: number = parseInt(request.query.id as string);
		const board: Board | undefined = await boardService.findById(id);
		response.status(200).send(board);
	} catch (err) {
		response.status(400).send('manage board list error');
	}
});

router.use('/create', verifyToken);
router.post('/create', async (request: Request, response: Response) => {
	const boardService = new BoardService();

	try {

		const board: Board = request.body.board;
		let result = await boardService.create(board);
		if (!result) {
			response.status(400).send('manage create board data error');
			return;
		}

		response.status(200).json(result);
	} catch (err) {
		response.status(400).send('manage board update error');
	}
});

router.use('/update', verifyToken);
router.put('/update', async (request: Request, response: Response) => {
	const boardService = new BoardService();

	try {

		const board: Board = request.body.board;
		let result = await boardService.update(board.id!, board);
		if (!result) {
			response.status(400).send('manage not exist board data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage board update error');
	}
});

router.put('/updateCount', async (request: Request, response: Response) => {
  const boardService = new BoardService();

  try {
    const id: number = parseInt(request.query.id as string);
    const result = await boardService.updateCount(id);
    if (!result) {
      response.status(400).send('manage not exist board data');
      return;
    }
    response.status(200).json('success');
  } catch (err) {
    response.status(400).send('manage board updateCount error');
  }
});

// router.use('/delete', verifyToken);
router.delete('/delete', async (request: Request, response: Response) => {
	const boardService = new BoardService();

	try {

		const deleteId: number = parseInt(request.query.id as string);
		let result = await boardService.delete(deleteId);
		if (!result) {
			response.status(400).send('manage not exist board data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage board delete error');
	}
});

export default router;