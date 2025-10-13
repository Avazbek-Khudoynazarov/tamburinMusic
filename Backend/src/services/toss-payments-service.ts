import axios from 'axios';
import { PaymentsService } from './payments-service';
import { Global } from '../global';

export class TossPaymentsService {
	constructor() {
	}

	//일반 결제 승인
	public async approvePayment(paymentKey: string, orderId: string, amount: number, paymentType: string): Promise<any> {
		try {
			const base64ApiKey = Buffer.from(`${paymentType === 'domestic_general' ? process.env.TOSS_DOMESTIC_GENERAL_SECRET_KEY : paymentType === 'domestic_subscription' ? process.env.TOSS_DOMESTIC_SUBSCRIPTION_SECRET_KEY : process.env.TOSS_INTERNATIONAL_SECRET_KEY}:`).toString('base64');
			const response = await axios.post(`https://api.tosspayments.com/v1/payments/confirm`, {
				paymentKey: paymentKey,
				orderId: orderId,
				amount: amount,
			}, {
				headers: {
					'Authorization': `Basic ${base64ApiKey}`,
					'Content-Type': 'application/json'
				}
			});
			return response.data;
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	//빌링키로 자동 결제 승인.
	public async approveAutoPayment(
		billingKey: string,
		customerKey: string,
		amount: number,
		orderId: string,
		orderName: string,
		customerName: string,
		customerEmail: string,
		paymentType: string
	): Promise<any> {
		try {
			const base64ApiKey = Buffer.from(`${paymentType === 'domestic_general' ? process.env.TOSS_DOMESTIC_GENERAL_SECRET_KEY : paymentType === 'domestic_subscription' ? process.env.TOSS_DOMESTIC_SUBSCRIPTION_SECRET_KEY : process.env.TOSS_INTERNATIONAL_SECRET_KEY}:`).toString('base64');
			const response = await axios.post(`https://api.tosspayments.com/v1/billing/${billingKey}`, {
				customerKey: customerKey,
				amount: amount,
				orderId: orderId,
				orderName: orderName,
				customerName: customerName,
				customerEmail: customerEmail,
			}, {
				headers: {
					'Authorization': `Basic ${base64ApiKey}`,
					'Content-Type': 'application/json'
				}
			});
			return response.data;
		} catch (error) {
			// console.log(error);
			return null;
		}
	}

	//해외결제용 빌링키 요청.
	public async requestBillingKeyForInternational(customerKey: string, cardNumber: string, cardExpirationYear: string, cardExpirationMonth: string): Promise<any> {
		try {
			const base64ApiKey = Buffer.from(`${process.env.TOSS_INTERNATIONAL_SECRET_KEY}:`).toString('base64');
			const response = await axios.post('https://api.tosspayments.com/v1/billing/authorizations/card', {
				customerKey: customerKey,
				cardNumber: cardNumber,
				cardExpirationYear: cardExpirationYear,
				cardExpirationMonth: cardExpirationMonth
			}, {
				headers: {
					'Authorization': `Basic ${base64ApiKey}`,
					'Content-Type': 'application/json'
				}
			});
			return response.data;
		} catch (error: any) {

			const apiData = error.response?.data;
			const code = apiData?.code ?? 'UNKNOWN_ERROR';
			const message = apiData?.message ?? error.message ?? 'Unknown error';
			const cleanMsg = message.replace(/\n/g, ' ').trim();
			const error_log = `${cleanMsg} - ${code}`;

			if(customerKey) {
				const paymentsService = new PaymentsService();
				await paymentsService.update(
					parseInt(customerKey, 10),
					{ error_log }
				);
			}

			console.log(error);
			return null;
		}
	}

	//빌링키 요청.
	public async requestBillingKey(customerKey: string, authKey: string, paymentType: string): Promise<any> {
		try {
			const base64ApiKey = Buffer.from(`${paymentType === 'domestic_general' ? process.env.TOSS_DOMESTIC_GENERAL_SECRET_KEY : paymentType === 'domestic_subscription' ? process.env.TOSS_DOMESTIC_SUBSCRIPTION_SECRET_KEY : process.env.TOSS_INTERNATIONAL_SECRET_KEY}:`).toString('base64');
			const response = await axios.post('https://api.tosspayments.com/v1/billing/authorizations/issue', {
				customerKey: customerKey,
				authKey: authKey
			}, {
				headers: {
					'Authorization': `Basic ${base64ApiKey}`,
					'Content-Type': 'application/json'
				}
			});
			return response.data;
		} catch (error : any) {

			const apiData = error.response?.data;
			const code = apiData?.code ?? 'UNKNOWN_ERROR';
			const message = apiData?.message ?? error.message ?? 'Unknown error';
			const cleanMsg = message.replace(/\n/g, ' ').trim();
			const error_log = `${cleanMsg} - ${code}`;

			if(customerKey) {
				const paymentsService = new PaymentsService();
				await paymentsService.update(
					parseInt(customerKey, 10),
					{ error_log }
				);
			}
			
			console.log(error);
			return null;
		}
	}

	//paymentKey로 결제 조회.
	public async getPayment(paymentKey: string, paymentType: string): Promise<any> {
		try {
			const base64ApiKey = Buffer.from(`${paymentType === 'domestic_general' ? process.env.TOSS_DOMESTIC_GENERAL_SECRET_KEY : paymentType === 'domestic_subscription' ? process.env.TOSS_DOMESTIC_SUBSCRIPTION_SECRET_KEY : process.env.TOSS_INTERNATIONAL_SECRET_KEY}:`).toString('base64');
			const response = await axios.get(`https://api.tosspayments.com/v1/payments/${paymentKey}`, {
				headers: {
					'Authorization': `Basic ${base64ApiKey}`
				}
			});
			return response.data;
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	//orderId로 결제 조회 (중복 결제 방지용)
	public async getPaymentByOrderId(orderId: string, paymentType: string): Promise<any> {
		try {
			const base64ApiKey = Buffer.from(`${paymentType === 'domestic_general' ? process.env.TOSS_DOMESTIC_GENERAL_SECRET_KEY : paymentType === 'domestic_subscription' ? process.env.TOSS_DOMESTIC_SUBSCRIPTION_SECRET_KEY : process.env.TOSS_INTERNATIONAL_SECRET_KEY}:`).toString('base64');
			const response = await axios.get(`https://api.tosspayments.com/v1/payments/orders/${orderId}`, {
				headers: {
					'Authorization': `Basic ${base64ApiKey}`
				}
			});
			return response.data;
		} catch (error) {
			// 결제가 존재하지 않는 경우 404 에러가 발생하므로 null 반환
			return null;
		}
	}
}