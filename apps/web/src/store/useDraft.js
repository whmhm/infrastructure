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
import { draftApi } from '@infrastructure-monorepo/api-client';
export const useDraft = create((set, get) => ({
    title: '',
    content: '',
    auth: {},
    id: 0,
    error: null,
    // 草稿保存时调用
    saveDraft: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { title, content, auth, id } = get();
            const draft = yield draftApi.createDraft({
                title,
                content,
                auth,
                id,
            });
            set({ content: draft.content, id: draft.id });
        }
        catch (error) {
            console.error('Failed to save draft:', error);
            set({ error: '保存草稿失败' });
        }
    }),
    //   获取草稿时调用
    getDraft: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const draft = yield draftApi.getDraft(get().id);
            set({ title: draft.title, content: draft.content });
        }
        catch (error) {
            console.error('Failed to get draft:', error);
            set({ error: '获取草稿失败' });
        }
    })
}));
