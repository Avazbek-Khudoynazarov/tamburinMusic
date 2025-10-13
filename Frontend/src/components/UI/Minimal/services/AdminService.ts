import axios from "axios";

import * as CONFIG from '@/config';
import AuthService from './AuthService';

const AdminService = { 
  async getAdminUserList(page: number, searchType: string, searchText: string) {
    try{
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL  }/manage/user/adminUserList?page=${  page.toString()  }&searchType=${  searchType  }&searchText=${  searchText}`, 
        {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        }
      );
      return response.data;
    }catch(err) {
      AuthService.clearLocalCredential();
      window.location.replace('/auth/sign-in');
      return undefined;
    }
  },

  async addUser(cellPhone: string, password: string, storeCode: string, authLevel: number, authValue: number) {
    try{
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL  }/manage/user/addAdminUser`, 
          {
              cellPhone,
              password,
              storeCode,
              authLevel,
              authValue
          },
          {
              headers: {
                  'Authorization': `Bearer ${AuthService.getToken()}`
              }
            }
         );
         return response.data;
      }catch(err) {
        if(err.response.data === "exist cellPhone") {
            return err.response.data;
        }
            AuthService.clearLocalCredential();
            window.location.replace('/auth/sign-in');
            return undefined;
        
      }
  },

  async updatePassword(id: number, oldPassword: string, newPassword: string) {
    try{
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL  }/manage/user/updatePassword`, 
        {
            id,
            oldPassword,
            newPassword
        },
        {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
          }
       );
       return response.data;
    }catch(err) {
      if(err.response.data === "oldpassword error") {
        return err.response.data;
      }
      return undefined;
    }
  },
  
  async updateProfile(id: number, cellPhone: string, storeCode: string, authLevel: number, authValue: number) {
    try{
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL  }/manage/user/updateAdminProfile`, 
        {
            id,
            cellPhone,
            storeCode,
            authLevel,
            authValue
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
      window.location.replace('/auth/sign-in');
      return undefined;
    }
  },

  async deleteUser(id: number) {
    try{
      const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL  }/manage/user/deleteAdminUser?id=${  id.toString()}`, 
        {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
          }
      );
      return response.data;
    }catch(err) {
      AuthService.clearLocalCredential();
      window.location.replace('/auth/sign-in');
      return undefined;
    }
  }
}

export default AdminService;