import mysql from 'mysql2/promise';
import { PoolOptions } from 'mysql2';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// 确保环境变量被加载
dotenv.config({ path: path.join(__dirname, '../../.env') });

// SSL证书路径
const SSL_CA_PATH = '/Users/devinrcai/Downloads/TencentDB-SSL-CA (1)/ca.pem';

// 验证证书文件是否存在
if (!fs.existsSync(SSL_CA_PATH)) {
  console.error('SSL证书文件不存在：', SSL_CA_PATH);
  process.exit(1);
}

// 读取证书内容
const sslCa = fs.readFileSync(SSL_CA_PATH);

const poolConfig: PoolOptions = {
  host: process.env.DB_HOST || 'gz-cdb-bh19rij3.sql.tencentcdb.com',
  port: parseInt(process.env.DB_PORT || '27323'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'risk_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '60000'),
  ssl: {
    ca: sslCa,
    minVersion: 'TLSv1.2',
    rejectUnauthorized: false  // 在开发环境中禁用证书验证
  }
};

// 创建连接池
const pool = mysql.createPool(poolConfig);

// 测试连接池
pool.getConnection()
  .then(connection => {
    console.log('数据库连接池初始化成功');
    connection.query('SHOW STATUS LIKE "Ssl_cipher"')
      .then(([sslStatus]) => {
        console.log('SSL 状态:', sslStatus);
      })
      .catch(console.error)
      .finally(() => {
        connection.release();
      });
  })
  .catch(error => {
    console.error('数据库连接池初始化失败:', error);
    process.exit(1);
  });

export default pool; 