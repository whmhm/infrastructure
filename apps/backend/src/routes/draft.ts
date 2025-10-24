import Router from 'koa-router';
import { DraftController } from '../controllers/draft';
import { DraftInfo } from '../types/users';

const router = new Router();
const draftController = new DraftController();

// 创建草稿
router.post('/', async (ctx) => {
  try {
    const draft = ctx.request.body as Omit<DraftInfo, 'id'>;
    const newDraft = await draftController.createDraft(draft);
    ctx.status = 201;
    ctx.body = newDraft;
  } catch (error: any) {
    console.error('Create draft error:', error);
    ctx.status = 400;
    ctx.body = { error: error.message || 'Failed to create draft' };
  }
});

// 获取单个草稿
router.get('/:id', async (ctx) => {
  try {
    const draftId = ctx.params.id;
    const draft = await draftController.getDraft(draftId);
    if (draft !== null) {
      ctx.status = 200;
      ctx.body = draft;
    } else {
      ctx.status = 404;
      ctx.body = { error: 'Draft not found' };
    }
  } catch (error: any) {
    console.error('Get draft error:', error);
    ctx.status = 500;
    ctx.body = { error: error.message || 'Failed to fetch draft' };
  }
});

// 获取用户的所有草稿
router.get('/user/:userId', async (ctx) => {
  try {
    const userId = Number(ctx.params.userId);
    const drafts = await draftController.getDraftsByUserId(userId);
    ctx.status = 200;
    ctx.body = drafts;
  } catch (error: any) {
    console.error('Get drafts by user error:', error);
    ctx.status = 500;
    ctx.body = { error: error.message || 'Failed to fetch drafts' };
  }
});

// 更新草稿
router.put('/:id', async (ctx) => {
  try {
    const draftId = ctx.params.id;
    const draftData = ctx.request.body as Partial<DraftInfo>;
    const updatedDraft = await draftController.updateDraft(draftId, draftData);
    if (updatedDraft !== null) {
      ctx.status = 200;
      ctx.body = updatedDraft;
    } else {
      ctx.status = 404;
      ctx.body = { error: 'Draft not found' };
    }
  } catch (error: any) {
    console.error('Update draft error:', error);
    ctx.status = 400;
    ctx.body = { error: error.message || 'Failed to update draft' };
  }
});

// 删除草稿
router.delete('/:id', async (ctx) => {
  try {
    const draftId = ctx.params.id;
    const success = await draftController.deleteDraft(draftId);
    if (success) {
      ctx.status = 204;
    } else {
      ctx.status = 404;
      ctx.body = { error: 'Draft not found' };
    }
  } catch (error: any) {
    console.error('Delete draft error:', error);
    ctx.status = 500;
    ctx.body = { error: error.message || 'Failed to delete draft' };
  }
});

export default router;



