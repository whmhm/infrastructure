import Router from 'koa-router';
import { API_PREFIX } from '../config';
import healthRouter from './health';
import userRouter from './users';
import draftRouter from './draft';

// 创建主路由实例
const router = new Router({
  prefix: API_PREFIX,
});

// 使用子路由并添加allowedMethods()以处理405和501错误
router.use(healthRouter.routes(), healthRouter.allowedMethods());
router.use('/users', userRouter.routes(), userRouter.allowedMethods());
router.use('/drafts', draftRouter.routes(), draftRouter.allowedMethods());

// 根路径
router.get('/', (ctx) => {
  ctx.status = 200;
  ctx.body = {
    message: 'Welcome to the API',
    version: '1.0.0',
    status: 'running',
  };
});

// 导出路由实例
export default router;