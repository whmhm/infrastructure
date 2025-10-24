import { HttpService } from './apiClient';
import { DraftInfo } from './types';
const draftService = new HttpService({
    baseURL: 'http://localhost:3001/api',
    timeout: 10000,
  });
const draftApi = {
  createDraft: async (draft: DraftInfo) => {
    return draftService.request<DraftInfo>({
        method: "POST",
        url: "/drafts",
        data: draft
    });
  },
  getDraft: async (id: number) => {
    return draftService.request<DraftInfo>({
        method: "GET",
        url: `/drafts/${id}`
    });
  },
};
export { draftApi };
