import axios from "axios";

import * as CONFIG from '../config';
import { Member } from '../models/member';
import { LiveChat } from '../models/liveChat';
import AuthService from './AuthService';

const MemberService = {

	
  async sendKakao(params) {
    try{
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/message/sendkakao`, 
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


  async sendEmail(params) {
    try{
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/message/sendemail`, 
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

	async isCertifyEmail(user_id: string, token: string) {
    try{
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/message/iscertifyemail`, 
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

	async certifyMail(data) {
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


	
	async getByCellphone(cellphone: string) {
		try {
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/frontend/member/list/all?cellphone=${cellphone.toString()}`,
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
	
	// async getByInfo(userId: string, name: string, cellphone: string) {
	// 	try {
	// 		const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/frontend/member/list/all?userId=${userId.toString()}&name=${name.toString()}&cellphone=${cellphone.toString()}`,
	// 			{
	// 				headers: {
	// 					'Authorization': `Bearer ${AuthService.getToken()}`
	// 				}
	// 			});
	// 		return response.data;
	// 	} catch (err) {
	// 		return undefined;
	// 	}
	// },


  async sendLiveChat(targetType: string, targetMemberId: number, message: string) {
    try{
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/member/chat`, 
        {
          targetType,
          targetMemberId,
          message
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

  async getLiveChatList(targetMemberId: number) {
    try{
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/member/chatList?target_member_id=${targetMemberId.toString()}`, 
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

  async getAllTypeList(type: string) {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/frontend/member/list/all?type=${  type.toString()}`, {
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
			const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/frontend/member/list/all`, {
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
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL  }/frontend/member/list?page=${  page.toString()}`, 
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
  
  async isEmailDuplicate(user_id: string) {
    try{
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL  }/frontend/member/isEmailDuplicate?user_id=${user_id}`, 
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
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL  }/frontend/member/get?id=${id.toString()}`, 
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

  async create(member: Member) {
    try{
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL  }/member/register`, 
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

  async update(member: Member) {
    member.approve_date = member.approve_date ? member.approve_date : new Date();
    try{
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL  }/frontend/member/update`, 
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
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL  }/frontend/member/updateProfile`, 
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

  async updatePassword(user_id: string, password: string) {
    try{
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL  }/frontend/member/updatePassword`, 
        {
            user_id,
            password,
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
      const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL  }/frontend/member/delete?id=${  id}`, 
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
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL  }/upload/data/member`, 
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

export default MemberService;