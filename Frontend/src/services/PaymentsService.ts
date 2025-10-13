import axios from "axios";

import * as CONFIG from '../config';
import { Payments } from '../models/payments';
import AuthService from './AuthService';

const PaymentsService = {
  async paymentLog(log: string) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/frontend/payments/log`, {
        log
      }, {
        headers: {
          'Authorization': `Bearer ${AuthService.getToken()}`
        }
      });
      return response.data;
    } catch (err) {
      AuthService.clearLocalCredential();
      window.location.replace('/');
      return undefined;
    }
  },

	async getByMemberIdAndStatus(member_id: number, status: number) {
		try {
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/frontend/payments/list/all?member_id=${member_id}&status=${status}`,
				{
					headers: {
						'Authorization': `Bearer ${AuthService.getToken()}`
					}
				}
			);
			return response.data;
		} catch (err) {
			AuthService.clearLocalCredential();
			window.location.replace('/');
			throw err; // undefined 대신 에러를 던져 호출자가 처리하도록
		}
	},



  async requestPayment(orderId: string, paymentKey: string, amount: number) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/frontend/payments/requestPayment`, {
        orderId,
        paymentKey,
        amount
      }, {
        headers: {
          'Authorization': `Bearer ${AuthService.getToken()}`
        }
      });
      return response.data;
    } catch (err) {
			alert('결제가 실패하였습니다.');
      // AuthService.clearLocalCredential();
      // window.location.replace('/');
      return undefined;
    }
  },

  async requestPeriodicPaymentForInternational(customerKey: string, cardNumber: string, cardExpirationYear: string, cardExpirationMonth: string) {
		try {
			const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/frontend/payments/requestPeriodicPayment`, {
				customerKey,
				cardNumber,
				cardExpirationYear,
				cardExpirationMonth
			}, {
				headers: {
					'Authorization': `Bearer ${AuthService.getToken()}`
				}
			});
			return response.data;
		} catch (err) {
			alert('결제가 실패하였습니다.');
			// AuthService.clearLocalCredential();
			// window.location.replace('/');
			return undefined;
		}
	},

	async requestPeriodicPayment(customerKey: string, authKey: string) {
		try {
			const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/frontend/payments/requestPeriodicPayment`, {
				customerKey,
				authKey
			}, {
				headers: {
					'Authorization': `Bearer ${AuthService.getToken()}`
				}
			});
			return response.data;
		} catch (err) {
			alert('결제가 실패하였습니다.');
			// AuthService.clearLocalCredential();
			// window.location.replace('/');
			return undefined;
		}
	},
	

	async getByTeacherId(teacher_id: number) {
		try {
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/frontend/payments/list/all?teacher_id=${teacher_id.toString()}`,
				{
					headers: {
						'Authorization': `Bearer ${AuthService.getToken()}`
					}
				});
			return response.data;
		} catch (err) {
			AuthService.clearLocalCredential();
			window.location.replace('/');
			return undefined;
		}
	},

	
	async getByMemberId(member_id: number) {
		try {
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/frontend/payments/list/all?member_id=${member_id.toString()}`,
				{
					headers: {
						'Authorization': `Bearer ${AuthService.getToken()}`
					}
				});
			return response.data;
		} catch (err) {
			AuthService.clearLocalCredential();
			window.location.replace('/');
			return undefined;
		}
	},

	async getAllList() {
		try {
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/frontend/payments/list/all`, {
				headers: {
					'Authorization': `Bearer ${AuthService.getToken()}`
				}
			});
			return response.data;
		} catch (err) {
			AuthService.clearLocalCredential();
			window.location.replace('/');
			return undefined;
		}
	},

  async getList(page: number) {
    try{
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL  }/frontend/payments/list?page=${  page.toString()}`, 
        {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        }
      );
      return response.data;
    }catch(err) {
      AuthService.clearLocalCredential();
      window.location.replace('/');
      return undefined;
    }
  },
  
  async get(id: number) {
    try{
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL  }/frontend/payments/get?id=${id.toString()}`, 
        {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        }
      );
      return response.data;
    }catch(err) {
      AuthService.clearLocalCredential();
      window.location.replace('/');
      return undefined;
    }
  },

	async getExperienceLesson() {

		try{
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL  }/frontend/payments/experienceLesson`, {
				headers: {
					'Authorization': `Bearer ${AuthService.getToken()}`
				}
			});
			return response.data;
		}catch(err) {
			return undefined;
		}
	},

  async create(payments: Payments) {
    try{
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL  }/frontend/payments/create`, 
        {
          payments,
        },
        {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
          }
       );
       return response.data;
    }catch(err) {
      return undefined;
    }
  },

  async update(payments: Payments) {
    try{
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL  }/frontend/payments/update`, 
        {
          payments,
        },
        {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
          }
       );
       return response.data;
    }catch(err) {
      return undefined;
    }
  },

  async updateProfile(id: string, nickName: string, cellPhone: string, imageFile: string, memo: string) {
    try{
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL  }/frontend/payments/updateProfile`, 
        {
            id,
            nickName,
            cellPhone,
        },
        {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
          }
       );
       return response.data;
    }catch(err) {
      AuthService.clearLocalCredential();
      window.location.replace('/');
      return undefined;
    }
  },
	
  async delete(id: number) {
    try{
      const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL  }/frontend/payments/delete?id=${  id}`, 
        {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
          }
      );
      return response.data;
    }catch(err) {
      AuthService.clearLocalCredential();
      window.location.replace('/');
      return undefined;
    }
  },

  async addAttachment(formData: any) {
    try{
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL  }/upload/image/payments`, 
        formData,
        {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
          }
      );
      return response.data;
    }catch(err) {
      AuthService.clearLocalCredential();
      window.location.replace('/');
      return undefined;
    }
  },

  async deleteAttachment(fileName: string) {
    try{
      const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL  }/upload/image?filename=${  fileName}`, 
        {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
          }
      );
      return response.data;
    }catch(err) {
      AuthService.clearLocalCredential();
      window.location.replace('/');
      return undefined;
    }
  },
}

export default PaymentsService;