import { create } from 'zustand';
import { User, draftApi } from '@infrastructure-monorepo/api-client';
interface DraftState {
    title: string;
    content: string;
    auth: User;
    id: number;
    error: string | null;
    saveDraft: () => Promise<void>;
    getDraft: () => Promise<void>;
}
export const useDraft = create<DraftState>((set, get) => ({
    title: '',
    content: '',
    auth: {} as User,
    id: 0,
    error: null,

    // 草稿保存时调用
    saveDraft: async () => {
        try {
            const { title, content, auth, id } = get();
            const draft = await draftApi.createDraft({
                title,
                content,
                auth,
                id,
            });
            set({ content: draft.content, id: draft.id });
        } catch (error) {
            console.error('Failed to save draft:', error);
            set({ error: '保存草稿失败' });
        }
    },
    //   获取草稿时调用
    getDraft: async () => {
        try {
            const draft = await draftApi.getDraft(get().id);
            set({ title: draft.title, content: draft.content });
        } catch (error) {
            console.error('Failed to get draft:', error);
            set({ error: '获取草稿失败' });
        }
    }
}))