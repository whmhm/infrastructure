import { DraftInfo } from "../types/users";

export class DraftModel {
    // 模拟草稿数据存储
    private drafts: DraftInfo[] = [];
    
    async create(draft: DraftInfo): Promise<DraftInfo> {
        // 为新草稿生成ID
        const newDraft: DraftInfo = {
            ...draft,
            id: this.drafts.length + 1
        };
        this.drafts.push(newDraft);
        return newDraft;
    }   
    
    async getDraft(id: number): Promise<DraftInfo | undefined> {
        return this.drafts.find(draft => draft.id === id);
    }
}