import axios from "axios";

import * as CONFIG from '@/config';
import useGlobalStore from '@/stores/globalStore';

const AuthService = {
  async loginBySocial(socialType: string, code: string) {
    try{
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/member/loginBySocial?type=${socialType}&code=${code}`);
      
      if(response.data.type === 'success') { 
        this.setLocalCredential(response.data.member.id, response.data.member.user_id, response.data.token);

        return {
          state: 'ok',
          member: response.data.member
        }

			} else if(response.data.type === 'register') { 
        return {
          state: 'register',
          member: response.data.member
        }

      }else{
        return {
          state: 'error',
          message: response.data.message
        }
      }
    }catch(err) {
      return {
        state: 'error',
        message: err.response.data.message
      };
    }
  },

  async login(user_id: string, password: string) {
    try{
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL  }/member/login?user_id=${user_id}&password=${password}`);
      if(response.data.type === 'success') { 
        this.setLocalCredential(response.data.id, user_id, response.data.token);
      }
      
      return {
        state: 'ok',
        ...response.data
      };
    }catch(err) {
      return {
        state: 'error',
        message: err.response.data.message
      };
    }
  },

  async adminLogin(user_id: string) {
    try{
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL  }/member/adminLogin?user_id=${user_id}`);
      if(response.data.type === 'success') { 
        this.setLocalCredential(response.data.id, user_id, response.data.token);
      }
      
      return {
        state: 'ok',
        ...response.data
      };
    }catch(err) {
      return {
        state: 'error',
        message: err.response.data.message
      };
    }
  },

  setLocalCredential(id: string, email: string, token: string) {
    localStorage.setItem('id', id);
    localStorage.setItem('email', email);
    localStorage.setItem('token', token);
  },

  getLocalCredential() {
    return {
      id: localStorage.getItem('id'),
      email: localStorage.getItem('email'),
      token: localStorage.getItem('token')
    };
  },

  getToken() {
    const token = localStorage.getItem('token');
    
    if(token === null && useGlobalStore.getState().isAuthenticated == true) {
        useGlobalStore.getState().setAuthenticated(false);
        return '';
    }

    return localStorage.getItem('token');
  },

  clearLocalCredential() {
    const emptyString = '';

    useGlobalStore.getState().setAuthenticated(false);
    localStorage.setItem('id', emptyString);
    localStorage.setItem('email', emptyString);
    localStorage.setItem('token', emptyString);
  }
}

export default AuthService;