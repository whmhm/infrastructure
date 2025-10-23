
import { DraftInfo } from "../types/users";
import { DraftModel } from "../model/draftModel";

const draftModel = new DraftModel();
export class DraftService {
    async createDraft(draft: DraftInfo) {
        return await draftModel.create(draft);
    }

    async getDraft(id: number) {
        return await draftModel.getDraft(id)
    }
}