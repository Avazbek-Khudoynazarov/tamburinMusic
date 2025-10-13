import axios from "axios";

import * as CONFIG from '@/config';
import { IClassesItem } from '@/components/UI/Minimal/types/user';
import AuthService from './AuthService';

const ClassesService = {


	async getByPaymentsId(payments_id: number) {
		try {
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/manage/classes/list/all?payments_id=${payments_id.toString()}`,
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
			const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/manage/classes/deleteByPaymentsId?payments_id=${payments_id}`,
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
				`${import.meta.env.VITE_SERVER_URL}/manage/classes/list/byDateRange?start_date=${startDate}&end_date=${endDate}`,
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

	async createRows(classes: IClassesItem[]) {
    try{
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL  }/manage/classes/createRows`, 
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

	async updateRows(classes: IClassesItem[]) {
		try {
			const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/manage/classes/updateRows`,
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
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/manage/classes/list/all`, {
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
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/manage/classes/list`,
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
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/manage/classes/get?id=${id.toString()}`,
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

	async create(classes: IClassesItem) {
		try {
			const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/manage/classes/create`,
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
			const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/manage/classes/createClasses`,
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

	async update(classes: IClassesItem) {
		try {
			const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/manage/classes/update`,
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
			const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/manage/classes/delete?id=${id}`,
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