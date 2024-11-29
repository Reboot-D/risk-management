import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('开始测试数据库连接...');
  console.log('连接配置:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
  });

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '27323'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
      },
      connectTimeout: 60000,
      authPlugins: {
        mysql_clear_password: () => () => Buffer.from(process.env.DB_PASSWORD + '\0')
      }
    });

    console.log('成功建立连接！');
    const [rows] = await connection.query('SELECT 1 as test');
    console.log('测试查询结果:', rows);

    await connection.end();
    console.log('连接测试完成！');
  } catch (error: any) {
    console.error('连接失败:', {
      错误代码: error.code,
      错误消息: error.message,
      系统调用: error.syscall,
      主机名: error.hostname,
      堆栈: error.stack
    });

    if (error.code === 'ECONNREFUSED') {
      console.error('\n可能的原因：');
      console.error('1. 实例外网地址未开启');
      console.error('2. 安全组未正确配置');
      console.error('3. 连接地址或端口不正确');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n可能的原因：');
      console.error('1. 账号密码错误');
      console.error('2. SSL 连接配置不正确');
    } else if (error.code === 'CERT_HAS_EXPIRED') {
      console.error('\n可能的原因：');
      console.error('1. SSL 证书已过期');
      console.error('2. 需要更新 SSL 证书配置');
    }
  }
}

testConnection(); 