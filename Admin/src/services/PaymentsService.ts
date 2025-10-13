import axios from "axios";

import { CONFIG } from 'src/config-global';
import { IPaymentsItem } from 'src/types/user';
import AuthService from './AuthService';

const PaymentsService = {

	async findAll(options: {
		where?: Record<string, any>;
		orderBy?: { column: string; direction?: 'ASC' | 'DESC' };
		limit?: number;
		offset?: number;
	}) {
		try {
			const response = await axios.post(`${CONFIG.serverUrl}/manage/payments/findAll`, options, {
				headers: {
					Authorization: `Bearer ${AuthService.getToken()}`
				}
			});
			return response.data;
		} catch (err) {
			AuthService.clearLocalCredential();
			window.location.replace('/');
			return undefined;
		}
	},


	async getByMemberIdAndStatus(member_id: number, status: number): Promise<IPaymentsItem[]> {
		try {
			const response = await axios.get(`${CONFIG.serverUrl}/manage/payments/list/all?member_id=${member_id}&status=${status}`,
				{
					headers: {
						'Authorization': `Bearer ${AuthService.getToken()}`
					}
				}
			);
			return response.data as IPaymentsItem[];
		} catch (err) {
			AuthService.clearLocalCredential();
			window.location.replace('/');
			throw err; // undefined 대신 에러를 던져 호출자가 처리하도록
		}
	},


	async getByTeacherId(teacher_id: number) {
		try {
			const response = await axios.get(`${CONFIG.serverUrl}/manage/payments/list/all?teacher_id=${teacher_id.toString()}`,
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
			const response = await axios.get(`${CONFIG.serverUrl}/manage/payments/list/all?member_id=${member_id.toString()}`,
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

	async getCalculateAllList(classes_status: string[], startDate: string, endDate: string, searchType: string, searchText: string) {
		try {
      
			const response = await axios.get(`${CONFIG.serverUrl}/manage/payments/calculate?classes_status=${classes_status}&start_date=${startDate}&end_date=${endDate}&search_type=${searchType}&search_text=${searchText}`, {
				headers: {
					'Authorization': `Bearer ${AuthService.getToken()}`
				}
			});
			console.log(response);
			return response.data;
		} catch (err) {
			console.log(err);
			// AuthService.clearLocalCredential();
			// window.location.replace('/');
			return undefined;
		}
	},

	async getAllList() {
		try {
			const response = await axios.get(`${CONFIG.serverUrl}/manage/payments/list/all`, {
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
		try {
			const response = await axios.get(`${CONFIG.serverUrl}/manage/payments/list?page=${page.toString()}`,
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
			const response = await axios.get(`${CONFIG.serverUrl}/manage/payments/get?id=${id.toString()}`,
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

	async create(payments: IPaymentsItem) {
		try {
			const response = await axios.post(`${CONFIG.serverUrl}/manage/payments/create`,
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
		} catch (err) {
			return undefined;
		}
	},

	async update(payments: IPaymentsItem) {
		try {
			const response = await axios.put(`${CONFIG.serverUrl}/manage/payments/update`,
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
		} catch (err) {
			return undefined;
		}
	},

	async updateProfile(id: string, nickName: string, cellPhone: string, imageFile: string, memo: string) {
		try {
			const response = await axios.put(`${CONFIG.serverUrl}/manage/payments/updateProfile`,
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
		} catch (err) {
			AuthService.clearLocalCredential();
			window.location.replace('/');
			return undefined;
		}
	},

	async delete(id: number) {
		try {
			const response = await axios.delete(`${CONFIG.serverUrl}/manage/payments/delete?id=${id}`,
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
			const response = await axios.post(`${CONFIG.serverUrl}/upload/image/payments`,
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

export default PaymentsService;