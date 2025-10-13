import axios from "axios";

import * as CONFIG from '../config';
import { Attachment } from '../models/attachment';
import AuthService from './AuthService';

const AttachmentService = {

	async getByEntity(entity_type: string, entity_id: number) {
		try {
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/frontend/attachment/list/all?entity_type=${entity_type}&entity_id=${entity_id.toString()}`,
			{
				headers: {
					'Authorization': `Bearer ${AuthService.getToken()}`
				}
			});
			return response.data;
		} catch (err) {
			console.error(err);
      return undefined;
		}
	},

	async getAllList() {
		try {
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/frontend/attachment/list/all`, {
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
	
	async getListByInstrumentIdAll(instrument_id : number) {
		try {
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/frontend/attachment/list/all?instrument_id=${  instrument_id.toString()}`, {
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
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL  }/frontend/attachment/list?page=${  page.toString()}`, 
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
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL  }/frontend/attachment/get?id=${id.toString()}`, 
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

  async create(attachment: Attachment) {
    try{
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL  }/frontend/attachment/create`, 
        {
          attachment,
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

  async update(attachment: Attachment) {
    try{
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL  }/frontend/attachment/update`, 
        {
          attachment,
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
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL  }/frontend/attachment/updateProfile`, 
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
      const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL  }/frontend/attachment/delete?id=${  id}`, 
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
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL  }/upload/data/editor`, 
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

export default AttachmentService;