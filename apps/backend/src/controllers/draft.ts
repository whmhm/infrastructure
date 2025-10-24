import { DraftInfo } from '../types/users';
import { DraftService } from '../services/draftService';

export class DraftController {
  private draftService: DraftService;

  constructor() {
    this.draftService = new DraftService();
  }

  // 创建草稿
  async createDraft(draftData: Omit<DraftInfo, 'id'>): Promise<DraftInfo> {
    return await this.draftService.createDraft(draftData);
  }

  // 根据ID获取草稿
  async getDraft(id: string): Promise<DraftInfo | null> {
    return await this.draftService.getDraft(id);
  }

  // 根据用户ID获取所有草稿
  async getDraftsByUserId(userId: number): Promise<DraftInfo[]> {
    return await this.draftService.getDraftsByUserId(userId);
  }

  // 更新草稿
  async updateDraft(id: string, draftData: Partial<DraftInfo>): Promise<DraftInfo | null> {
    return await this.draftService.updateDraft(id, draftData);
  }

  // 删除草稿
  async deleteDraft(id: string): Promise<boolean> {
    return await this.draftService.deleteDraft(id);
  }
  
}