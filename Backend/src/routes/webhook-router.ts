import { Router, Request, Response } from 'express';
import { PaymentsService } from '../services/payments-service';

const router = Router();

router.post('/payments', async (request: Request, response: Response) => {
	const paymentsService = new PaymentsService();
	
	try{
		if(request.body.orderId == undefined) {
			response.status(400).send('not allowed request');
			return;
		}

		const orderId = request.body.orderId;
		const status = request.body.status;
		const createdAt = request.body.createdAt;

		const paymentId = parseInt(orderId.split('-')[1]);
		const payments = await paymentsService.findById(paymentId);
		if(!payments) {
			response.status(400).send('payment data not found');
			return;
		}

		if(status !== 'DONE') {
			response.status(400).send('payments webhood status error : ' + status);
			return;
		}

		await paymentsService.update(paymentId, {
			status: 20,
			payment_method: 'virtual_account',
			pg_pay_no: payments.pg_pay_no,
			payment_date: createdAt,
		});

        response.status(200).send('success');
	}catch(err) {
		console.log(err);
		response.status(400).send('request payment error');
	}
});

export default router;