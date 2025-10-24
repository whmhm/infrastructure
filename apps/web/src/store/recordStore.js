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
export const useRecordStore = create((set, get) => ({
    error: null,
    notes: [],
    currentNote: null,
    // 保存或更新笔记
    saveNote: (content, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // 模拟用户数据，实际应用中应该从登录状态获取
            const mockUser = {
                id: 1,
                name: '测试用户',
                email: 'test@example.com'
            };
            const draftInfo = {
                id: id || Date.now(),
                title: content.length > 20 ? content.substring(0, 20) + '...' : content || '无标题笔记',
                content,
                auth: mockUser
            };
            const savedDraft = yield draftApi.createDraft(draftInfo);
            // 更新本地状态
            const updatedNotes = id
                ? get().notes.map(note => note.id === id ? Object.assign(Object.assign({}, note), { content, updatedAt: new Date() }) : note)
                : [{ id: draftInfo.id, content, createdAt: new Date(), updatedAt: new Date() }, ...get().notes];
            set({
                notes: updatedNotes,
                currentNote: savedDraft,
                error: null
            });
        }
        catch (error) {
            console.error('保存笔记失败:', error);
            set({ error: '保存笔记失败' });
        }
    }),
    // 获取所有笔记
    getNotes: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // 实际应用中应该调用获取笔记列表的API
            // 这里暂时返回空数组，因为当前draftApi没有获取列表的接口
            set({ notes: [], error: null });
            return [];
        }
        catch (error) {
            console.error('获取笔记列表失败:', error);
            set({ error: '获取笔记列表失败' });
            return [];
        }
    }),
    // 获取单个笔记
    getNote: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const draft = yield draftApi.getDraft(id);
            const note = {
                id: draft.id,
                content: draft.content,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            set({ currentNote: note, error: null });
            return note;
        }
        catch (error) {
            console.error('获取笔记失败:', error);
            set({ error: '获取笔记失败' });
            return null;
        }
    }),
    // 删除笔记
    deleteNote: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // 实际应用中应该调用删除笔记的API
            // 这里暂时只更新本地状态
            const updatedNotes = get().notes.filter(note => note.id !== id);
            set({ notes: updatedNotes, error: null });
        }
        catch (error) {
            console.error('删除笔记失败:', error);
            set({ error: '删除笔记失败' });
        }
    }),
    // 清除错误
    clearError: () => {
        set({ error: null });
    }
}));
