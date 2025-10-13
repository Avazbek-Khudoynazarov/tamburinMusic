import axios from "axios";

import * as CONFIG from '../config';
import { Banner } from '../models/banner';
import AuthService from './AuthService';

const BannerService = {

	
	async getByEntityType(entity_type: string) {
		try {
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/frontend/banner/list/all?entity_type=${entity_type}`,
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

	
	async deleteByEntityType(entity_type: string) {
		try {
			const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/frontend/banner/deleteByEntityType?entity_type=${entity_type}`,
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


	async createRows(banner: Banner[]) {
    try{
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL  }/frontend/banner/createRows`, 
        {
          banner,
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

	async updateRows(banner: Banner[]) {
		try {
			const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/frontend/banner/updateRows`,
				{
					banner,
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
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/frontend/banner/list/all`, {
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
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL  }/frontend/banner/list?page=${  page.toString()}`, 
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
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL  }/frontend/banner/get?id=${id.toString()}`, 
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

  async create(banner: Banner) {
    try{
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL  }/frontend/banner/create`, 
        {
          banner,
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

  async update(banner: Banner) {
    try{
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL  }/frontend/banner/update`, 
        {
          banner,
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
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL  }/frontend/banner/updateProfile`, 
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
      const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL  }/frontend/banner/delete?id=${  id}`, 
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
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL  }/upload/data/banner`, 
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

export default BannerService;