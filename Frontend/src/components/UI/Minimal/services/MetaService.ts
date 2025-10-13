import axios from "axios";

import * as CONFIG from '@/config';
import { IMetaItem } from '@/components/UI/Minimal/types/user';
import AuthService from './AuthService';

const MetaService = {
	async getList(type: string) {
		try {
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/manage/meta/list?type=${type.toString()}`,
				{
					headers: {
						'Authorization': `Bearer ${AuthService.getToken()}`
					}
				}
			);
			return response.data;
		} catch (err) {
			AuthService.clearLocalCredential();
			window.location.replace('/auth/sign-in');
			return undefined;
		}
	},


	async updateRows(meta: IMetaItem[]) {
		try {
			const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/manage/meta/updateRows`,
				{
					meta,
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


	async update(meta: IMetaItem) {
		try {
			const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/manage/meta/update`,
				{
					meta,
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

	async addAttachment(formData: any) {
    try{
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL  }/upload/data/meta`, 
        formData,
        {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`,
								'Content-Type': 'multipart/form-data' 
            }
          }
      );
      return response.data;
    }catch(err) {
      console.error(err);
      return undefined;
    }
  },


}

export default MetaService;