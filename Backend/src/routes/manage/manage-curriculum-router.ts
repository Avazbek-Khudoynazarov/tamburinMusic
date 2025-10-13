import { Router, Request, Response } from 'express';
import { verifyToken } from '../../authorization';
import { CurriculumService } from '../../services/curriculum-service';
import { Curriculum } from '../../model/curriculum';

const router = Router();


router.use('/list', verifyToken);

// 전체 목록
router.get('/list/all', async (request: Request, response: Response) => {
	const curriculumService = new CurriculumService();

	try {
		const instrument_id: number = parseInt(request.query.instrument_id as string);
		
		let curriculumList;
		if (instrument_id) {
      curriculumList = await curriculumService.findByInstrumentIdAll(Number(instrument_id));
    } else {
      curriculumList = await curriculumService.findAll();
    }

		response.status(200).send(curriculumList);
	} catch (err) {
		response.status(400).send('manage curriculum list error');
	}
});

// 페이지네이션 목록
router.get('/list', async (request: Request, response: Response) => {
	const curriculumService = new CurriculumService();

	try {
		const page: number = parseInt(request.query.page as string);
		const curriculumList: Curriculum[] = await curriculumService.findWithPagination('', page, 20);
		response.status(200).send(curriculumList);
	} catch (err) {
		response.status(400).send('manage curriculum list error');
	}
});


router.use('/get', verifyToken);
router.get('/get', async (request: Request, response: Response) => {
	const curriculumService = new CurriculumService();

	try {
		const id: number = parseInt(request.query.id as string);
		const curriculum: Curriculum | undefined = await curriculumService.findById(id);
		response.status(200).send(curriculum);
	} catch (err) {
		response.status(400).send('manage curriculum list error');
	}
});

router.use('/create', verifyToken);
router.post('/create', async (request: Request, response: Response) => {
	const curriculumService = new CurriculumService();

	try {
		const type: string = response.locals['type'];
		if (type !== 'admin') {
			response.status(400).send('not authorization');
			return;
		}

		const curriculum: Curriculum = request.body.curriculum;
		let result = await curriculumService.create(curriculum);
		if (!result) {
			response.status(400).send('manage create curriculum data error');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage curriculum update error');
	}
});

router.use('/update', verifyToken);
router.put('/update', async (request: Request, response: Response) => {
	const curriculumService = new CurriculumService();

	try {
		const type: string = response.locals['type'];
		if (type !== 'admin') {
			response.status(400).send('not authorization');
			return;
		}

		const curriculum: Curriculum = request.body.curriculum;
		let result = await curriculumService.update(curriculum.id!, curriculum);
		if (!result) {
			response.status(400).send('manage not exist curriculum data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage curriculum update error');
	}
});

router.use('/delete', verifyToken);
router.delete('/delete', async (request: Request, response: Response) => {
	const curriculumService = new CurriculumService();

	try {
		const type: string = response.locals['type'];
		if (type !== 'admin') {
			response.status(400).send('not authorization');
			return;
		}

		const deleteId: number = parseInt(request.query.id as string);
		let result = await curriculumService.delete(deleteId);
		if (!result) {
			response.status(400).send('manage not exist curriculum data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage curriculum delete error');
	}
});

export default router;