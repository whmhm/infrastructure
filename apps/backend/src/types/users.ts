
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

export interface DraftInfo {
  id: string; // 修改为string类型，与MongoDB的ObjectId兼容
  userId: number;
  title: string;
  content: string;
  createdAt?: Date; // 添加创建时间
  updatedAt?: Date; // 添加更新时间
}