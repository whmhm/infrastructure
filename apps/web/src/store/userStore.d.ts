import { User } from '@infrastructure-monorepo/api-client';
interface UserState {
    users: User[];
    loading: boolean;
    error: string | null;
    loadUsers: () => Promise<void>;
    addUser: (name: string) => Promise<void>;
}
export declare const useUserStore: import("zustand").UseBoundStore<import("zustand").StoreApi<UserState>>;
export {};
//# sourceMappingURL=userStore.d.ts.map