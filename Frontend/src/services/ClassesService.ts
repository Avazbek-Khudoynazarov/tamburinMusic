import axios from "axios";

import * as CONFIG from '../config';
import { Classes } from '../models/classes';
import AuthService from './AuthService';

const ClassesService = {

	
	async getByMemberId2(member_id: number) {
		try {
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/frontend/classes/front_list/all?member_id=${member_id.toString()}`,
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

	
	async getByTeacherId2(teacher_id: number) {
		try {
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/frontend/classes/front_list/all?teacher_id=${teacher_id.toString()}`,
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
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/frontend/classes/list/all?member_id=${member_id.toString()}`,
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

	async getByTeacherId(teacher_id: number) {
		try {
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/frontend/classes/list/all?teacher_id=${teacher_id.toString()}`,
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

	async getByPaymentsId(payments_id: number) {
		try {
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/frontend/classes/list/all?payments_id=${payments_id.toString()}`,
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

	async deleteByPaymentsId(payments_id: number) {
		try {
			const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/frontend/classes/deleteByPaymentsId?payments_id=${payments_id}`,
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
			return undefined;
		}
	},

	async getByDateRange(startDate: string, endDate: string) {
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_SERVER_URL}/frontend/classes/list/byDateRange?start_date=${startDate}&end_date=${endDate}`,
				{
					headers: {
						Authorization: `Bearer ${AuthService.getToken()}`,
					},
				}
			);
			return response.data;
		} catch (err) {
			AuthService.clearLocalCredential();
			window.location.replace('/');
			return undefined;
		}
	},

	async createRows(classes: Classes[]) {
    try{
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL  }/frontend/classes/createRows`, 
        {
          classes,
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

	async updateRows(classes: Partial<Classes>[]) {
		try {
			const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/frontend/classes/updateRows`,
				{
					classes,
				},
				{
					headers: {
						'Authorization': `Bearer ${AuthService.getToken()}`
					}
				}
			);
			return response.data;
		} catch (err) {
			return undefined;
		}
	},



	


	async getAllList() {
		try {
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/frontend/classes/list/all`, {
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

	async getList() {
		try {
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/frontend/classes/list`,
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
			return undefined;
		}
	},

	async get(id: number) {
		try {
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/frontend/classes/get?id=${id.toString()}`,
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
			return undefined;
		}
	},

	async create(classes: Classes) {
		try {
			const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/frontend/classes/create`,
				{
					classes,
				},
				{
					headers: {
						'Authorization': `Bearer ${AuthService.getToken()}`
					}
				}
			);
			return response.data;
		} catch (err) {
			return undefined;
		}
	},

	async createClasses(payments_id: Number | undefined, total_classes: Number) {
		try {
			const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/frontend/classes/createClasses`,
				{
					payments_id,
					total_classes,
				},
				{
					headers: {
						'Authorization': `Bearer ${AuthService.getToken()}`
					}
				}
			);
			return response.data;
		} catch (err) {
			return undefined;
		}
	},

	async update(classes: Classes) {
		try {
			const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/frontend/classes/update`,
				{
					classes,
				},
				{
					headers: {
						'Authorization': `Bearer ${AuthService.getToken()}`
					}
				}
			);
			return response.data;
		} catch (err) {
			return undefined;
		}
	},

	async delete(id: number) {
		try {
			const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/frontend/classes/delete?id=${id}`,
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
			return undefined;
		}
	},

	async addAttachment(formData: any) {
		try {
			const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/upload/image/classes`,
				formData,
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
			return undefined;
		}
	},

	async deleteAttachment(fileName: string) {
		try {
			const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/upload/image?filename=${fileName}`,
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
			return undefined;
		}
	},
}

export default ClassesService;