import { create } from 'zustand';
import { User, draftApi, DraftInfo } from '@infrastructure-monorepo/api-client';

interface Note {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface RecordState {
  error: string | null;
  notes: Note[];
  currentNote: Note | null;
  saveNote: (content: string, id?: number) => Promise<void>;
  getNotes: () => Promise<Note[]>;
  getNote: (id: number) => Promise<Note | null>;
  deleteNote: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useRecordStore = create<RecordState>((set, get) => ({
  error: null,
  notes: [],
  currentNote: null,

  // 保存或更新笔记
  saveNote: async (content: string, id?: number) => {
    try {
      // 模拟用户数据，实际应用中应该从登录状态获取
      const mockUser: User = {
        id: 1,
        name: '测试用户',
        email: 'test@example.com'
      };

      const draftInfo: DraftInfo = {
        id: id || Date.now(),
        title: content.length > 20 ? content.substring(0, 20) + '...' : content || '无标题笔记',
        content,
        auth: mockUser
      };

      const savedDraft = await draftApi.createDraft(draftInfo);
      
      // 更新本地状态
      const updatedNotes = id 
        ? get().notes.map(note => note.id === id ? { ...note, content, updatedAt: new Date() } : note)
        : [{ id: draftInfo.id, content, createdAt: new Date(), updatedAt: new Date() }, ...get().notes];
      
      set({ 
        notes: updatedNotes,
        currentNote: savedDraft as unknown as Note,
        error: null 
      });
    } catch (error) {
      console.error('保存笔记失败:', error);
      set({ error: '保存笔记失败' });
    }
  },

  // 获取所有笔记
  getNotes: async () => {
    try {
      // 实际应用中应该调用获取笔记列表的API
      // 这里暂时返回空数组，因为当前draftApi没有获取列表的接口
      set({ notes: [], error: null });
      return [];
    } catch (error) {
      console.error('获取笔记列表失败:', error);
      set({ error: '获取笔记列表失败' });
      return [];
    }
  },

  // 获取单个笔记
  getNote: async (id: number) => {
    try {
      const draft = await draftApi.getDraft(id);
      const note: Note = {
        id: draft.id,
        content: draft.content,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      set({ currentNote: note, error: null });
      return note;
    } catch (error) {
      console.error('获取笔记失败:', error);
      set({ error: '获取笔记失败' });
      return null;
    }
  },

  // 删除笔记
  deleteNote: async (id: number) => {
    try {
      // 实际应用中应该调用删除笔记的API
      // 这里暂时只更新本地状态
      const updatedNotes = get().notes.filter(note => note.id !== id);
      set({ notes: updatedNotes, error: null });
    } catch (error) {
      console.error('删除笔记失败:', error);
      set({ error: '删除笔记失败' });
    }
  },

  // 清除错误
  clearError: () => {
    set({ error: null });
  }
}))