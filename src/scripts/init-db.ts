import fs from 'fs';
import path from 'path';
import pool from '../config/database';
import { logger } from '../utils/logger';

async function initDatabase() {
  try {
    logger.info('Starting database initialization...');

    // 读取 SQL 文件
    const sqlPath = path.join(__dirname, '../config/init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // 执行 SQL 语句
    await pool.query(sql);

    logger.info('Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initDatabase(); 