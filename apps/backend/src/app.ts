import Koa, { Context, Next } from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import router from './routes/index';

// 创建Koa应用实例
const app = new Koa();

// 配置中间件
app.use(cors({
  origin: '*', // 允许所有来源访问
  credentials: true, // 允许携带凭证
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 允许的HTTP方法
  allowHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'] // 允许的请求头
})); // 启用CORS
app.use(bodyParser()); // 解析请求体
app.use(logger()); // 日志记录

// 使用路由
app.use(router.routes());
app.use(router.allowedMethods());

// 404处理
app.use((ctx: Context) => {
  ctx.status = 404;
  ctx.body = {
    error: 'Not Found',
    message: 'The requested resource was not found',
  };
});

// 错误处理中间件
app.use(async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    console.error('Server error:', error);
    ctx.status = 500;
    ctx.body = {
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    };
  }
});

export default app;