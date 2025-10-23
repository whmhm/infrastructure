import { DraftInfo } from '../types/users';
import { DraftService } from '../services/draftService';

export class DraftController {
    private draftService: DraftService;

    constructor() {
        this.draftService = new DraftService();
    }

    // 创建草稿
    async createDraft(draftData: DraftInfo): Promise<DraftInfo> {
        return await this.draftService.createDraft(draftData);
    }

    // 获取草稿
    async getDraft(id: number): Promise<DraftInfo | undefined> {
        return await this.draftService.getDraft(id);
    }
}