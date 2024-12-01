import { Router } from 'express';
import authRoutes from './auth.routes';
import dataRoutes from './data.routes';
import testRoutes from './test.routes';
import tradeRoutes from './trade.routes';

const router = Router();

// 测试路由
router.use('/test', testRoutes);

// 认证路由
router.use('/auth', authRoutes);

// 数据路由
router.use('/data', dataRoutes);

// 交易路由
router.use('/trades', tradeRoutes);

// API 根路径
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: '风险数据管理系统 API',
    version: '1.0.0',
    endpoints: {
      test: '/api/test',
      auth: '/api/auth',
      data: '/api/data',
      trades: '/api/trades'
    }
  });
});

export { router as routes }; 