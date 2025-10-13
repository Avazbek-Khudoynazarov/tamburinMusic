import axios from "axios";

import * as CONFIG from '@/config';
import { IClassesBoardReplyItem } from '@/components/UI/Minimal/types/user';
import AuthService from './AuthService';

const ClassesBoardReplyService = {

	

	async getByClassesBoardId(classes_board_id: number) {
		try {
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/manage/classesBoardReply/list/all?classes_board_id=${classes_board_id.toString()}`,
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
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/manage/classesboardreply/list/all`, {
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
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL  }/manage/classesboardreply/list?page=${  page.toString()}`, 
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
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL  }/manage/classesboardreply/get?id=${id.toString()}`, 
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

  async create(classesboardreply: IClassesBoardReplyItem) {
    try{
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL  }/manage/classesboardreply/create`, 
        {
          classesboardreply,
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

  async update(classesboardreply: IClassesBoardReplyItem) {
    try{
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL  }/manage/classesboardreply/update`, 
        {
          classesboardreply,
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
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL  }/manage/classesboardreply/updateProfile`, 
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
      const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL  }/manage/classesboardreply/delete?id=${  id}`, 
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
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL  }/upload/image/classesboardreply`, 
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

export default ClassesBoardReplyService;