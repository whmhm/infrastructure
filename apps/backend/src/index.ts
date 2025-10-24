import app from './app';
import { PORT } from './config';
import { connectToDatabase, disconnectFromDatabase } from './config/database';

// 启动服务器并连接数据库
async function startServer() {
  try {
    // 尝试连接到MongoDB数据库
    // 即使连接失败，服务也会继续启动
    await connectToDatabase();
    
    // 启动HTTP服务器
    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('登录接口可用: POST http://localhost:${PORT}/api/login');
    });

    // 优雅关闭处理
    const handleShutdown = async () => {
      console.log('Server shutting down...');
      
      // 停止接收新的连接
      server.close(async () => {
        console.log('HTTP server closed');
        
        // 断开数据库连接
        await disconnectFromDatabase();
        
        // 退出进程
        process.exit(0);
      });
    };

    // 监听终止信号
    process.on('SIGINT', handleShutdown);
    process.on('SIGTERM', handleShutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// 启动服务器
startServer();