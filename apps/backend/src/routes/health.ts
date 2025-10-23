import Router from 'koa-router';
import { NODE_ENV } from '../config';

const router = new Router();

// 健康检查端点
router.get('/health', (ctx) => {
  ctx.status = 200;
  ctx.body = {
    status: 'healthy',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  };
});

// 就绪检查端点
router.get('/ready', (ctx) => {
  ctx.status = 200;
  ctx.body = {
    ready: true,
    timestamp: new Date().toISOString(),
  };
});

export default router;