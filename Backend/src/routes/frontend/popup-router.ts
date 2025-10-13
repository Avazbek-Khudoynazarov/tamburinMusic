import { Router, Request, Response } from 'express';
import { verifyToken } from '../../authorization';
import { PopupService } from '../../services/popup-service';
import { Popup } from '../../model/popup';

const router = Router();


// router.use('/list', verifyToken);

// 전체 목록
router.get('/list/all', async (request: Request, response: Response) => {
	const popupService = new PopupService();

	try {
		const day: string = request.query.day as string;
		let popupList;



		if(day) {
			popupList = await popupService.findToday();

		} else {
			popupList = await popupService.findAll();
		}

		

		response.status(200).send(popupList);
	} catch (err) {
		response.status(400).send('manage popup list error');
	}
});

// 페이지네이션 목록
router.get('/list', async (request: Request, response: Response) => {
	const popupService = new PopupService();

	try {
		const page: number = parseInt(request.query.page as string);
		const popupList: Popup[] = await popupService.findWithPagination('', page, 20);
		response.status(200).send(popupList);
	} catch (err) {
		response.status(400).send('manage popup list error');
	}
});


// router.use('/get', verifyToken);
router.get('/get', async (request: Request, response: Response) => {
	const popupService = new PopupService();

	try {
		const id: number = parseInt(request.query.id as string);
		const popup: Popup | undefined = await popupService.findById(id);
		response.status(200).send(popup);
	} catch (err) {
		response.status(400).send('manage popup list error');
	}
});

// router.use('/create', verifyToken);
router.post('/create', async (request: Request, response: Response) => {
	const popupService = new PopupService();

	try {
		
		const popup: Popup = request.body.popup;
		let result = await popupService.create(popup);
		if (!result) {
			response.status(400).send('manage create popup data error');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage popup update error');
	}
});

// router.use('/update', verifyToken);
router.put('/update', async (request: Request, response: Response) => {
	const popupService = new PopupService();

	try {
		
		const popup: Popup = request.body.popup;
		let result = await popupService.update(popup.id!, popup);
		if (!result) {
			response.status(400).send('manage not exist popup data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage popup update error');
	}
});

// router.use('/delete', verifyToken);
router.delete('/delete', async (request: Request, response: Response) => {
	const popupService = new PopupService();

	try {
		
		const deleteId: number = parseInt(request.query.id as string);
		let result = await popupService.delete(deleteId);
		if (!result) {
			response.status(400).send('manage not exist popup data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage popup delete error');
	}
});

export default router;