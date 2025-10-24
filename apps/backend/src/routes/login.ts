import Router from 'koa-router';
import { UserController } from '../controllers/users';
import { LoginRequest } from '../types/users';

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
      // 生成简单的token（实际应用中应该使用JWT或其他安全机制）
      const token = `mock-token-${user.id}-${Date.now()}`;
      
      ctx.status = 200;
      ctx.body = {
        success: true,
        user,
        token
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

export default router;