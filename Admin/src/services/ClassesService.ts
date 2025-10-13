import axios from "axios";

import { CONFIG } from 'src/config-global';
import { IClassesItem } from 'src/types/user';
import AuthService from './AuthService';

const ClassesService = {


	async getCountClassesByTeacher(member_id: number, type: string) {
		try {
			const response = await axios.get(`${CONFIG.serverUrl}/manage/classes/count?member_id=${member_id}&type=${type}`,
				{
					headers: {
						'Authorization': `Bearer ${AuthService.getToken()}`
					}
				});
			return response.data;
		} catch (err) {
			// console.log(err);
			AuthService.clearLocalCredential();
			window.location.replace('/');
			return undefined;
		}
	},

	async getByPaymentsId(payments_id: number) {
		try {
			const response = await axios.get(`${CONFIG.serverUrl}/manage/classes/list/all?payments_id=${payments_id.toString()}`,
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
			const response = await axios.delete(`${CONFIG.serverUrl}/manage/classes/deleteByPaymentsId?payments_id=${payments_id}`,
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
				`${CONFIG.serverUrl}/manage/classes/list/byDateRange?start_date=${startDate}&end_date=${endDate}`,
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
      const response = await axios.post(`${CONFIG.serverUrl  }/manage/classes/createRows`, 
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
			const response = await axios.put(`${CONFIG.serverUrl}/manage/classes/updateRows`,
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
			const response = await axios.get(`${CONFIG.serverUrl}/manage/classes/list/all`, {
				headers: {
					'Authorization': `Bearer ${AuthService.getToken()}`
				}
			});
			return response.data;
		} catch (err) {
			// AuthService.clearLocalCredential();
			// window.location.replace('/');
			return undefined;
		}
	},

	async getList() {
		try {
			const response = await axios.get(`${CONFIG.serverUrl}/manage/classes/list`,
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
			const response = await axios.get(`${CONFIG.serverUrl}/manage/classes/get?id=${id.toString()}`,
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
			const response = await axios.post(`${CONFIG.serverUrl}/manage/classes/create`,
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
			const response = await axios.post(`${CONFIG.serverUrl}/manage/classes/createClasses`,
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
			const response = await axios.put(`${CONFIG.serverUrl}/manage/classes/update`,
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
			const response = await axios.delete(`${CONFIG.serverUrl}/manage/classes/delete?id=${id}`,
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
			const response = await axios.post(`${CONFIG.serverUrl}/upload/image/classes`,
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
			const response = await axios.delete(`${CONFIG.serverUrl}/upload/image?filename=${fileName}`,
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