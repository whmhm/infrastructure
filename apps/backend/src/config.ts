// 应用配置
export const PORT = process.env.PORT || 3001;
export const NODE_ENV = process.env.NODE_ENV || 'development';

// 数据库配置（示例配置，实际使用时根据需求修改）
export const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'example_db',
};

// API配置
export const API_PREFIX = '/api';

// CORS配置
export const CORS_CONFIG = {
  origin: '*', // 生产环境应该配置具体的域名
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
};