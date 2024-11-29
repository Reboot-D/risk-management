import dotenv from 'dotenv';
// 确保最先加载环境变量
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';
import { routes } from './routes';
import { testConnection } from './config/database';
import { logger } from './utils/logger';

const app = express();
const port = process.env.PORT || 3000;

// 基础中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS 配置
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// 安全配置
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));

// 日志
app.use(morgan('dev'));

// API 路由
app.use('/api', routes);

// 错误处理
app.use(errorHandler);

// 启动服务器
const startServer = async () => {
  try {
    // 测试数据库连接
    const isConnected = await testConnection();
    if (!isConnected) {
      logger.error('Unable to connect to database. Server will not start.');
      process.exit(1);
    }

    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
      logger.info(`CORS enabled for http://localhost:3001`);
    });
  } catch (error) {
    logger.error('Server startup error:', error);
    process.exit(1);
  }
};

startServer(); 