import axios from "axios";

import * as CONFIG from '@/config';
import useGlobalStore from '@/stores/globalStore';

const AuthService = {
  async login(admin_id: string, password: string) {
    try{
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL  }/admin/login?admin_id=${admin_id}&password=${password}`);
      if(response.data.type === 'success') { 
        this.setLocalCredential(response.data.id, admin_id, response.data.token);
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
    sessionStorage.setItem('id', id);
    sessionStorage.setItem('email', email);
    sessionStorage.setItem('token', token);
  },

  getLocalCredential() {
    return {
      id: sessionStorage.getItem('id'),
      email: sessionStorage.getItem('email'),
      token: sessionStorage.getItem('token')
    };
  },

  getToken() {
    return sessionStorage.getItem('token');
  },

  clearLocalCredential() {
    const emptyString = '';

    useGlobalStore.getState().setAuthenticated(false);
    sessionStorage.setItem('id', emptyString);
    sessionStorage.setItem('email', emptyString);
    sessionStorage.setItem('token', emptyString);
  }
}

export default AuthService;