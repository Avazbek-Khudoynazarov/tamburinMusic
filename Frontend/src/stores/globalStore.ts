import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware'

import { Member } from '../models/member';

interface GlobalStore {
  isAuthenticated: boolean;
  setAuthenticated: (isAuthenticated: boolean) => void;

  member: Member | null;
  setMember: (member: Member) => void;
}

const localStoragePersist: PersistStorage<GlobalStore> = {
  getItem: (name) => {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

const useGlobalStore = create(
  persist<GlobalStore>(
    (set) => ({
      isAuthenticated: false, //로그인 여부.
      setAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated: isAuthenticated }),
      
      member: null, //로그인된 어드민 객체.
      setMember: (member: Member) => set({ member: member }),
    }),
    {
      name: 'global-storage',
      storage: localStoragePersist
    }
  )
);

export default useGlobalStore;