import express from 'express';
import { testConnection } from '../config/db';

const router = express.Router();

router.get('/test-db', async (req, res) => {
  const isConnected = await testConnection();
  res.json({ 
    status: isConnected ? 'success' : 'error',
    message: isConnected ? '数据库连接正常' : '数据库连接失败'
  });
});

export default router; 