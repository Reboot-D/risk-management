import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const pool = mysql.createPool({
  host: 'gz-cdb-bh19rij3.sql.tencentcdb.com',
  user: 'root',
  password: 'AB8Vyft3koyn9x**h4PAw',
  database: 'risk_management',
  port: 27323,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    ca: fs.readFileSync('/Users/devinrcai/Downloads/TencentDB-SSL-CA (1)/ca.pem')
  }
});

// 测试连接
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('数据库连接成功！');
    connection.release();
    return true;
  } catch (error: any) {
    console.error('数据库连接失败：', error);
    console.error('错误详情：', error.message);
    return false;
  }
}

export { pool, testConnection }; 