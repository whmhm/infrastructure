import app from './app';
import { PORT } from './config';

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// 优雅关闭处理
process.on('SIGINT', () => {
  console.log('Server shutting down...');
  process.exit(0);
});