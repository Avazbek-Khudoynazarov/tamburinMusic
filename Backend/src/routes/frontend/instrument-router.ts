import { Router, Request, Response } from 'express';
import { verifyToken } from '../../authorization';
import { InstrumentService } from '../../services/instrument-service';
import { Instrument } from '../../model/instrument';

const router = Router();


// router.use('/list', verifyToken);

// 전체 목록
router.get('/list/all', async (request: Request, response: Response) => {
	const instrumentService = new InstrumentService();

	try {
		const instrumentList = await instrumentService.findAll();

		response.status(200).send(instrumentList);
	} catch (err) {
		response.status(400).send('manage instrument list error');
	}
});

// 페이지네이션 목록
router.get('/list', async (request: Request, response: Response) => {
	const instrumentService = new InstrumentService();

	try {
		const page: number = parseInt(request.query.page as string);
		const instrumentList: Instrument[] = await instrumentService.findWithPagination('', page, 20);
		response.status(200).send(instrumentList);
	} catch (err) {
		response.status(400).send('manage instrument list error');
	}
});


// router.use('/get', verifyToken);
router.get('/get', async (request: Request, response: Response) => {
	const instrumentService = new InstrumentService();

	try {
		const id: number = parseInt(request.query.id as string);
		const instrument: Instrument | undefined = await instrumentService.findById(id);
		response.status(200).send(instrument);
	} catch (err) {
		response.status(400).send('manage instrument list error');
	}
});

// router.use('/create', verifyToken);
router.post('/create', async (request: Request, response: Response) => {
	const instrumentService = new InstrumentService();

	try {
		
		const instrument: Instrument = request.body.instrument;
		let result = await instrumentService.create(instrument);
		if (!result) {
			response.status(400).send('manage create instrument data error');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage instrument update error');
	}
});

// router.use('/update', verifyToken);
router.put('/update', async (request: Request, response: Response) => {
	const instrumentService = new InstrumentService();

	try {
		
		const instrument: Instrument = request.body.instrument;
		let result = await instrumentService.update(instrument.id!, instrument);
		if (!result) {
			response.status(400).send('manage not exist instrument data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage instrument update error');
	}
});

// router.use('/delete', verifyToken);
router.delete('/delete', async (request: Request, response: Response) => {
	const instrumentService = new InstrumentService();

	try {
		
		const deleteId: number = parseInt(request.query.id as string);
		let result = await instrumentService.delete(deleteId);
		if (!result) {
			response.status(400).send('manage not exist instrument data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage instrument delete error');
	}
});

export default router;