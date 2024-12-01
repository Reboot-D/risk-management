import { Router } from 'express';
import pool from '../config/database';

const router = Router();

// 基本健康检查
router.get('/health', (req, res) => {
  res.json({ status: 'success', message: 'API服务正常运行' });
});

// 数据库连接测试
router.get('/db', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('SELECT 1 + 1 as result');
    connection.release();
    res.json({ status: 'success', data: result });
  } catch (error) {
    console.error('数据库测试失败:', error);
    res.status(500).json({ 
      status: 'error', 
      message: '数据库连接失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 环境变量测试
router.get('/env', (req, res) => {
  res.json({
    status: 'success',
    data: {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT,
      dbHost: process.env.DB_HOST?.replace(/./g, '*'),
      corsOrigins: ['http://localhost:3000', 'http://localhost:3001']
    }
  });
});

export default router; 