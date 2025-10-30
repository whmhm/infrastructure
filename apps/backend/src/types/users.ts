
// 定义用户接口
export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // 密码字段，响应时可选
  createdAt: Date;
  updatedAt: Date;
}

// 用户创建/更新请求接口
export interface UserCreateRequest {
  name: string;
  email: string;
  password: string; // 创建用户时需要密码
}

// 登录请求接口
export interface LoginRequest {
  username: string;
  password: string;
}

// 登录响应接口
export interface LoginResponse {
  success: boolean;
  user?: User;
  token?: string;
  expiresIn?: string;
  error?: string;
}

// JWT相关类型
export interface JwtPayload {
  userId: number;
  username: string;
  email: string;
}

// Koa上下文扩展类型
declare module 'koa' {
  interface Context {
    state: {
      user?: {
        userId: number;
        username: string;
        email: string;
      };
    };
  }
}

export interface DraftInfo {
  id: string; // 修改为string类型，与MongoDB的ObjectId兼容
  userId: number;
  title: string;
  content: string;
  createdAt?: Date; // 添加创建时间
  updatedAt?: Date; // 添加更新时间
}