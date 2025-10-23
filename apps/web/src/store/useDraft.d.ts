import { User } from '@infrastructure-monorepo/api-client';
interface DraftState {
    title: string;
    content: string;
    auth: User;
    id: number;
    error: string | null;
    saveDraft: () => Promise<void>;
    getDraft: () => Promise<void>;
}
export declare const useDraft: import("zustand").UseBoundStore<import("zustand").StoreApi<DraftState>>;
export {};
//# sourceMappingURL=useDraft.d.ts.map