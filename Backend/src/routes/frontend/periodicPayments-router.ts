import { Router, Request, Response } from 'express';
import { verifyToken } from '../../authorization';
import { PeriodicPaymentsService } from '../../services/periodicPayments-service';
import { PeriodicPayments } from '../../model/periodicPayments';

const router = Router();


// router.use('/list', verifyToken);

// 전체 목록
router.get('/list/all', async (request: Request, response: Response) => {
	const periodicpaymentsService = new PeriodicPaymentsService();

	try {
		const periodicpaymentsList = await periodicpaymentsService.findAll();

		response.status(200).send(periodicpaymentsList);
	} catch (err) {
		response.status(400).send('manage periodicpayments list error');
	}
});

// 페이지네이션 목록
router.get('/list', async (request: Request, response: Response) => {
	const periodicpaymentsService = new PeriodicPaymentsService();

	try {
		const page: number = parseInt(request.query.page as string);
		const periodicpaymentsList: PeriodicPayments[] = await periodicpaymentsService.findWithPagination('', page, 20);
		response.status(200).send(periodicpaymentsList);
	} catch (err) {
		response.status(400).send('manage periodicpayments list error');
	}
});


// router.use('/get', verifyToken);
router.get('/get', async (request: Request, response: Response) => {
	const periodicpaymentsService = new PeriodicPaymentsService();

	try {
		const id: number = parseInt(request.query.id as string);
		const periodicpayments: PeriodicPayments | undefined = await periodicpaymentsService.findById(id);
		response.status(200).send(periodicpayments);
	} catch (err) {
		response.status(400).send('manage periodicpayments list error');
	}
});

// router.use('/create', verifyToken);
router.post('/create', async (request: Request, response: Response) => {
	const periodicpaymentsService = new PeriodicPaymentsService();

	try {
		
		const periodicpayments: PeriodicPayments = request.body.periodicpayments;
		let result = await periodicpaymentsService.create(periodicpayments);
		if (!result) {
			response.status(400).send('manage create periodicpayments data error');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage periodicpayments update error');
	}
});

// router.use('/update', verifyToken);
router.put('/update', async (request: Request, response: Response) => {
	const periodicpaymentsService = new PeriodicPaymentsService();

	try {
		
		const periodicpayments: PeriodicPayments = request.body.periodicpayments;
		let result = await periodicpaymentsService.update(periodicpayments.id!, periodicpayments);
		if (!result) {
			response.status(400).send('manage not exist periodicpayments data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage periodicpayments update error');
	}
});

// router.use('/delete', verifyToken);
router.delete('/delete', async (request: Request, response: Response) => {
	const periodicpaymentsService = new PeriodicPaymentsService();

	try {
		
		const deleteId: number = parseInt(request.query.id as string);
		let result = await periodicpaymentsService.delete(deleteId);
		if (!result) {
			response.status(400).send('manage not exist periodicpayments data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage periodicpayments delete error');
	}
});

export default router;