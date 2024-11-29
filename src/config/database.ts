import mysql from 'mysql2/promise';
import { PoolOptions } from 'mysql2';
import dotenv from 'dotenv';

// 确保环境变量被加载
dotenv.config();

console.log('Starting database connection...');
console.log('Environment variables:', {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_CONNECTION_TIMEOUT: process.env.DB_CONNECTION_TIMEOUT
});

const poolConfig: PoolOptions = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '27323'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 1,
  queueLimit: 0,
  connectTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '60000'),
  ssl: undefined
};

const pool = mysql.createPool(poolConfig);

// 添加连接测试
export const testConnection = async () => {
  try {
    console.log('\n=== 开始连接测试 ===');
    console.log('1. 检查配置信息...');
    
    // 验证必要的配置
    if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_USER || !process.env.DB_PASSWORD) {
      throw new Error('数据库配置不完整，请检查环境变量');
    }

    console.log('2. 尝试建立连接...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '27323'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: undefined,
      connectTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '60000')
    });

    console.log('3. 连接成功，执行测试查询...');
    const [rows] = await connection.query('SELECT 1 as test');
    console.log('查询结果:', rows);

    console.log('4. 关闭连接...');
    await connection.end();
    console.log('=== 连接测试完成 ===\n');
    return true;
  } catch (error: any) {
    console.error('\n=== 连接测试失败 ===');
    console.error('错误详情:', {
      错误代码: error.code,
      错误消息: error.message,
      系统调用: error.syscall,
      主机名: error.hostname,
      堆栈: error.stack
    });

    // 根据腾讯云文档添加具体的错误处理
    if (error.code === 'ECONNREFUSED') {
      console.error('\n可能的原因：');
      console.error('1. 实例外网地址未开启');
      console.error('2. 安全组未正确配置');
      console.error('3. 连接地址或端口不正确');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n可能的原因：');
      console.error('1. 用户名或密码错误');
      console.error('2. 用户没有外网访问权限');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('\n可能的原因：');
      console.error('1. 网络连接超时');
      console.error('2. 安全组或网络ACL可能阻止了连接');
    }

    console.error('=== 诊断结束 ===\n');
    return false;
  }
};

export default pool; 