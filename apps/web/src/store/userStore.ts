import { create } from 'zustand';
import { getAllUsers, createUser, User } from '@infrastructure-monorepo/api-client';


interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  loadUsers: () => Promise<void>;
  addUser: (name: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  loading: false,
  error: null,
  
  loadUsers: async () => {
    set({ loading: true, error: null });
    try {
      const usersData  = await getAllUsers();
      set({ users: usersData.data, loading: false });
    } catch (error) {
      console.error('Failed to load users:', error);
      set({ error: '加载用户失败', loading: false });
    }
  },
  
  addUser: async (name: string) => {
    try {
      const newUser = await createUser({
        name,
        email: `${name.toLowerCase()}@example.com`,
      });
      set((state) => ({ users: [newUser, ...state.users] }));
    } catch (error) {
      console.error('Failed to create user:', error);
      set({ error: '添加用户失败' });
    }
  },
}));