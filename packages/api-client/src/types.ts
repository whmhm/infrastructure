export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}


export interface DraftInfo {
  title: string,
  content: string,
  auth: User,
  id: number,
}