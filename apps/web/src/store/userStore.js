var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { create } from 'zustand';
import { getAllUsers, createUser } from '@infrastructure-monorepo/api-client';
export const useUserStore = create((set) => ({
    users: [],
    loading: false,
    error: null,
    loadUsers: () => __awaiter(void 0, void 0, void 0, function* () {
        set({ loading: true, error: null });
        try {
            const usersData = yield getAllUsers();
            set({ users: usersData.data, loading: false });
        }
        catch (error) {
            console.error('Failed to load users:', error);
            set({ error: '加载用户失败', loading: false });
        }
    }),
    addUser: (name) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newUser = yield createUser({
                name,
                email: `${name.toLowerCase()}@example.com`,
            });
            set((state) => ({ users: [newUser, ...state.users] }));
        }
        catch (error) {
            console.error('Failed to create user:', error);
            set({ error: '添加用户失败' });
        }
    }),
}));
