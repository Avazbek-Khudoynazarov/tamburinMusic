import axios from "axios";

import { CONFIG } from 'src/config-global';
import { IMemberItem } from 'src/types/user';
import AuthService from './AuthService';

// import type { Member } from '../models/member';

const MemberService = {

	async sendKakao(params: any) {
    try{
      const response = await axios.post(`${CONFIG.serverUrl}/message/sendkakao`, 
        {
          params
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


  async sendEmail(params: any) {
    try{
      const response = await axios.post(`${CONFIG.serverUrl}/message/sendemail`, 
        {
          params
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

	async verificateMail(user_id: string, token: string) {
    try{
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/message/verificatemail`, 
        {
          user_id,
          token
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

	
	async certifyMail(data:any) {
    try{
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/message/certifyemail`, 
        {
          data
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

	async getAllTypeList(type: string) {
		try {
			const response = await axios.get(`${CONFIG.serverUrl}/manage/member/list/all?type=${  type.toString()}`, {
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
			const response = await axios.get(`${CONFIG.serverUrl}/manage/member/list/all`, {
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
      const response = await axios.get(`${CONFIG.serverUrl  }/manage/member/list?page=${  page.toString()}`, 
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
      const response = await axios.get(`${CONFIG.serverUrl  }/manage/member/get?id=${id.toString()}`, 
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

  async create(member: IMemberItem) {
    try{
      const response = await axios.post(`${CONFIG.serverUrl  }/manage/member/create`, 
        {
          member,
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

  async update(member: IMemberItem) {
    member.approve_date = member.approve_date ? member.approve_date : new Date();
    try{
      const response = await axios.put(`${CONFIG.serverUrl  }/manage/member/update`, 
        {
          member,
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

  async updateClasses(member: IMemberItem) {
    member.approve_date = member.approve_date ? member.approve_date : new Date();
    try{
      const response = await axios.put(`${CONFIG.serverUrl  }/manage/member/updateClasses`, 
        {
          member,
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
      const response = await axios.put(`${CONFIG.serverUrl  }/manage/member/updateProfile`, 
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
      const response = await axios.delete(`${CONFIG.serverUrl  }/manage/member/delete?id=${  id}`, 
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
      const response = await axios.post(`${CONFIG.serverUrl  }/upload/data/member`, 
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
      const response = await axios.delete(`${CONFIG.serverUrl  }/upload/image?filename=${  fileName}`, 
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

export default MemberService;