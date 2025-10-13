import { create } from 'zustand';
import { persist } from 'zustand/middleware'

import type { Admin } from '../models/admin';

interface GlobalStore {
  isAuthenticated: boolean;
  setAuthenticated: (isAuthenticated: boolean) => void;

  admin: Admin | null;
  setAdmin: (admin: Admin) => void;
}

const useGlobalStore = create(
  persist<GlobalStore>(
    (set) => ({
      isAuthenticated: false, // 로그인 여부.
      setAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
      
      admin: null, // 로그인된 어드민 객체.
      setAdmin: (admin: Admin) => set({ admin }),
    }),
    {
      name: 'global-storage',
    }
  )
);

export default useGlobalStore;