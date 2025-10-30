import Router from 'koa-router';
import { UserController } from '../controllers/users';
import { LoginRequest } from '../types/users';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config';

const router = new Router();
const userController = new UserController();

// 用户登录接口
router.post('/login', async (ctx) => {
  try {
    const credentials = ctx.request.body as LoginRequest;
    
    // 验证请求数据
    if (!credentials.username || !credentials.password) {
      ctx.status = 400;
      ctx.body = { error: '用户名和密码不能为空' };
      return;
    }
    
    // 调用控制器进行登录
    const user = await userController.login(credentials);
    
    if (user) {
      // 使用JWT生成token
        const token = jwt.sign(
          { userId: user.id, username: user.name, email: user.email },
          process.env.JWT_SECRET || 'your-secret-key-change-in-production',
          { expiresIn: '24h' }
        );
      
      ctx.status = 200;
      ctx.body = {
        success: true,
        user,
        token,
        expiresIn: JWT_CONFIG.expiresIn
      };
    } else {
      ctx.status = 401;
      ctx.body = {
        success: false,
        error: '用户名或密码错误'
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: '登录失败，请稍后重试'
    };
  }
});

// 用户登出接口（可选，在前端清除token即可，后端可以实现token黑名单）
router.post('/logout', async (ctx) => {
  ctx.status = 200;
  ctx.body = {
    success: true,
    message: '登出成功'
  };
});

export default router;