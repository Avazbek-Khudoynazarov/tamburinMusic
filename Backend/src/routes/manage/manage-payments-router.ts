import { Router, Request, Response } from 'express';
import { verifyToken } from '../../authorization';
import { PaymentsService } from '../../services/payments-service';
import { Payments } from '../../model/payments';

const router = Router();


router.use('/calculate', verifyToken);
router.get('/calculate', async (request: Request, response: Response) => {
	const paymentsService = new PaymentsService();

	try {
		const classesStatusArray = request.query.classes_status; //출석 여부. (10 - 수업전, 20 - 수업완료, 30 - 수업불참)
		const startDate = request.query.start_date as string;
		const endDate = request.query.end_date as string;
		const searchType = request.query.search_type as string;
		const searchText = request.query.search_text as string;

		const classesStatusNumberArray = [];
		if(classesStatusArray !== undefined) {
			if(classesStatusArray!.toString().indexOf('수업전') >= 0) {
				classesStatusNumberArray.push(10);
			}
			if(classesStatusArray!.toString().indexOf('수업완료') >= 0) {
				classesStatusNumberArray.push(20);
			}
			if(classesStatusArray!.toString().indexOf('수업불참') >= 0) {
				classesStatusNumberArray.push(30);
			}
		}

		const paymentsList = await paymentsService.findCalculateAll(classesStatusNumberArray, startDate, endDate, searchType, searchText);

		const result = paymentsList.map((item) => ({
			...item,
			class_count: Number(item.class_count), // BigInt → Number 변환
		}));

		response.status(200).send(result);
	} catch (err) {
		response.status(400).send('manage payments list error');
	}
});


router.use('/findAll', verifyToken);
router.post('/findAll', async (req: Request, res: Response) => {
	const paymentsService = new PaymentsService();

	try {
		const options = req.body;
		const results = await paymentsService.findAll(options);
		res.status(200).json(results);
	} catch (err) {
		console.error(err);
		res.status(400).send('manage classes findMany error');
	}
});


router.use('/list', verifyToken);

// 전체 목록
router.get('/list/all', async (request: Request, response: Response) => {
	const paymentsService = new PaymentsService();

	try {
		const member_id: number = parseInt(request.query.member_id as string);
		const teacher_id: number = parseInt(request.query.teacher_id as string);
		const status: number = parseInt(request.query.status as string);
		let paymentsList;

		if (member_id && status !== undefined) {
      paymentsList = await paymentsService.findByMemberIdAndStatus(member_id, status);

		} else if(member_id) {
			paymentsList = await paymentsService.findByMemberId(member_id);
		}

		else if(teacher_id) {
			paymentsList = await paymentsService.findByTeacherId(teacher_id);
		}
		
		else {
			paymentsList = await paymentsService.findAll2();
		}



		response.status(200).send(paymentsList);
	} catch (err) {
		response.status(400).send('manage payments list error');
	}
});

// 페이지네이션 목록
router.get('/list', async (request: Request, response: Response) => {
	const paymentsService = new PaymentsService();

	try {
		const page: number = parseInt(request.query.page as string);
		const paymentsList: Payments[] = await paymentsService.findWithPagination('', page, 20);
		response.status(200).send(paymentsList);
	} catch (err) {
		response.status(400).send('manage payments list error');
	}
});


router.use('/get', verifyToken);
router.get('/get', async (request: Request, response: Response) => {
	const paymentsService = new PaymentsService();

	try {
		const id: number = parseInt(request.query.id as string);
		const payments: Payments | undefined = await paymentsService.findById(id);
		response.status(200).send(payments);
	} catch (err) {
		response.status(400).send('manage payments list error');
	}
});

router.use('/create', verifyToken);
router.post('/create', async (request: Request, response: Response) => {
	const paymentsService = new PaymentsService();

	try {
		const type: string = response.locals['type'];
		if (type !== 'admin') {
			response.status(400).send('not authorization');
			return;
		}

		const payments: Payments = request.body.payments;
		let result = await paymentsService.create(payments);
		if (!result) {
			response.status(400).send('manage create payments data error');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage payments update error');
	}
});

router.use('/update', verifyToken);
router.put('/update', async (request: Request, response: Response) => {
	const paymentsService = new PaymentsService();

	try {
		const type: string = response.locals['type'];
		if (type !== 'admin') {
			response.status(400).send('not authorization');
			return;
		}

		const payments: Payments = request.body.payments;
		let result = await paymentsService.update(payments.id!, payments);
		if (!result) {
			response.status(400).send('manage not exist payments data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage payments update error');
	}
});

router.use('/delete', verifyToken);
router.delete('/delete', async (request: Request, response: Response) => {
	const paymentsService = new PaymentsService();

	try {
		const type: string = response.locals['type'];
		if (type !== 'admin') {
			response.status(400).send('not authorization');
			return;
		}

		const deleteId: number = parseInt(request.query.id as string);
		let result = await paymentsService.delete(deleteId);
		if (!result) {
			response.status(400).send('manage not exist payments data');
			return;
		}

		response.status(200).json('success');
	} catch (err) {
		response.status(400).send('manage payments delete error');
	}
});

export default router;