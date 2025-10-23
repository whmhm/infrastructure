
// 定义用户接口
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// 用户创建/更新请求接口
export interface UserCreateRequest {
  name: string;
  email: string;
}

export interface DraftInfo {
  id: number;
  userId: number;
  title: string;
  content: string;
}