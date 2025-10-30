import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config';
import { JwtPayload } from '../types/users';

/**
 * JWT认证中间件
 * 验证请求头中的Authorization token是否有效
 */
export const authMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  try {
    // 获取Authorization头
    const authHeader = ctx.headers.authorization;
    
    // 检查Authorization头是否存在且格式正确
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      ctx.status = 401;
      ctx.body = {
        error: '未授权',
        message: '缺少有效的Authorization头'
      };
      return;
    }
    
    // 提取token
    const token = authHeader.split(' ')[1];
    
    try {
      // 验证token
      const decoded = jwt.verify(token, JWT_CONFIG.secret) as JwtPayload;
      
      // 将用户信息存储在上下文中，供后续路由使用
      ctx.state.user = {
        userId: decoded.userId,
        username: decoded.username,
        email: decoded.email
      };
      
      // 继续处理请求
      await next();
    } catch (error) {
      // token验证失败
      ctx.status = 401;
      ctx.body = {
        error: '未授权',
        message: '无效的token'
      };
    }
  } catch (error) {
      // 其他错误
      console.error('认证中间件错误:', error);
    ctx.status = 500;
    ctx.body = {
      error: '服务器错误',
      message: '认证过程中发生错误'
    };
  }
};

/**
 * 可选认证中间件
 * 如果提供了token则验证，但不强制要求
 */
export const optionalAuthMiddleware = async (ctx: Context, next: Next): Promise<void> => {
  try {
    const authHeader = ctx.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      
      try {
        const decoded = jwt.verify(token, JWT_CONFIG.secret) as JwtPayload;
        ctx.state.user = {
          userId: decoded.userId,
          username: decoded.username,
          email: decoded.email
        };
      } catch (error) {
        // token无效时静默忽略，不阻止请求继续
        console.debug('无效的token，但允许请求继续');
      }
    }
    
    await next();
  } catch (error) {
    console.error('可选认证中间件错误:', error);
    await next(); // 即使出错也允许请求继续
  }
};