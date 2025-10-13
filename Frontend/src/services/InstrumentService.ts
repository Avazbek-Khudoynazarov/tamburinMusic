import axios from "axios";

import * as CONFIG from '../config';
import { Instrument } from '../models/instrument';
import AuthService from './AuthService';

const InstrumentService = {

	async getAllList() {
		try {
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/frontend/instrument/list/all`, {
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
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL  }/frontend/instrument/list?page=${  page.toString()}`, 
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
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL  }/frontend/instrument/get?id=${id.toString()}`, 
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

  async create(instrument: Instrument) {
    try{
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL  }/frontend/instrument/create`, 
        {
          instrument,
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

  async update(instrument: Instrument) {
    try{
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL  }/frontend/instrument/update`, 
        {
          instrument,
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
	
  async delete(id: number) {
    try{
      const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL  }/frontend/instrument/delete?id=${  id}`, 
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
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL  }/upload/data/instrument`, 
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

export default InstrumentService;