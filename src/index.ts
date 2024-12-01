import express from 'express';
import cors from 'cors';
import { createTradeTable } from './models/trade.model';
import tradeRoutes from './routes/trade.routes';

const app = express();
const port = process.env.PORT || 3001;

// CORS 配置
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ]
}));

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/trades', tradeRoutes);

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || '服务器内部错误'
  });
});

// 初始化数据库表
async function initDatabase() {
  try {
    await createTradeTable();
    console.log('数据库初始化成功');
  } catch (error) {
    console.error('数据库初始化失败：', error);
    process.exit(1);
  }
}

// 启动服务器
async function startServer() {
  await initDatabase();
  
  app.listen(port, () => {
    console.log(`服务器运行在端口 ${port}`);
  });
}

startServer(); 