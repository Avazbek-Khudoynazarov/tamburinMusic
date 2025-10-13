import axios from "axios";

import { CONFIG } from 'src/config-global';
import { IMetaItem } from 'src/types/user';
import AuthService from './AuthService';

const MetaService = {
	async getList(type: string) {
		try {
			const response = await axios.get(`${CONFIG.serverUrl}/manage/meta/list?type=${type.toString()}`,
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
			const response = await axios.put(`${CONFIG.serverUrl}/manage/meta/updateRows`,
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
			const response = await axios.put(`${CONFIG.serverUrl}/manage/meta/update`,
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
      const response = await axios.post(`${CONFIG.serverUrl  }/upload/data/meta`, 
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