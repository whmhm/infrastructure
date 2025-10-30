import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/infrastructure-monorepo';

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB 连接成功');
    return true;
  } catch (error) {
    console.warn('⚠️ MongoDB 连接失败:', error);
    console.warn('⚠️ 服务将继续运行，但部分功能可能不可用');
    // 不退出进程，让服务继续运行
    return false;
  }
};

export const disconnectFromDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB 断开连接');
  } catch (error) {
    console.error('❌ MongoDB 断开连接失败:', error);
  }
};