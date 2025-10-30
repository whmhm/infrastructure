
import { DraftInfo } from '../types/users';
import { createDraft, getDraftById, getDraftsByUserId, updateDraft, deleteDraft } from '../model/draftModel';

export class DraftService {
  // 创建草稿
  async createDraft(draft: Omit<DraftInfo, 'id'>): Promise<DraftInfo> {
    const createdDraft = await createDraft(draft);
    return createdDraft as unknown as DraftInfo;
  }

  // 根据ID获取草稿
  async getDraft(id: string): Promise<DraftInfo | null> {
    const draft = await getDraftById(id);
    return draft ? (draft as unknown as DraftInfo) : null;
  }

  // 根据用户ID获取所有草稿
  async getDraftsByUserId(userId: number): Promise<DraftInfo[]> {
    const drafts = await getDraftsByUserId(userId);
    return drafts as unknown as DraftInfo[];
  }

  // 更新草稿
  async updateDraft(id: string, draftData: Partial<DraftInfo>): Promise<DraftInfo | null> {
    const updatedDraft = await updateDraft(id, draftData);
    return updatedDraft ? (updatedDraft as unknown as DraftInfo) : null;
  }

  // 删除草稿
  async deleteDraft(id: string): Promise<boolean> {
    const deletedDraft = await deleteDraft(id);
    return !!deletedDraft;
  }
}