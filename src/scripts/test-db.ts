import pool from '../config/database';
import { logger } from '../utils/logger';

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    logger.info('数据库连接成功！');
    
    // 测试查询
    const [rows] = await connection.query('SELECT 1');
    logger.info('查询测试成功：', rows);
    
    connection.release();
    process.exit(0);
  } catch (error) {
    logger.error('数据库连接测试失败：', error);
    process.exit(1);
  }
}

testConnection(); 