import Router from 'koa-router';
import { DraftController } from '../controllers/draft';
import { DraftInfo } from '../types/users';

const router = new Router();
const draftController = new DraftController();

// 创建草稿
router.post('/', async (ctx) => {
    try {
        const draft = ctx.request.body as DraftInfo;
        const newDraft = await draftController.createDraft(draft);
        ctx.status = 201;
        ctx.body = newDraft;
    } catch (error) {
        ctx.status = 400;
        ctx.body = { error: 'Failed to create draft' };
    }
});

// 获取草稿
router.get('/:id', async (ctx) => {
    try {
        const draftId = Number(ctx.params.id);
        const draft = await draftController.getDraft(draftId);
        if (draft !== undefined) {
            ctx.status = 200;
            ctx.body = draft;
        } else {
            ctx.status = 404;
            ctx.body = { error: 'Draft not found' };
        }
    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to fetch draft' };
    }
});

export default router;



