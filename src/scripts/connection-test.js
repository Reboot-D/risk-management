const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  console.log('Starting connection test...');
  console.log('Database configuration:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
  });

  try {
    // 第一步：测试DNS解析
    console.log('\n1. Testing DNS resolution...');
    const dns = require('dns');
    const { promisify } = require('util');
    const lookup = promisify(dns.lookup);
    
    try {
      const { address, family } = await lookup(process.env.DB_HOST);
      console.log('DNS lookup successful:', { address, family });
    } catch (dnsError) {
      console.error('DNS lookup failed:', dnsError);
      return;
    }

    // 第二步：创建连接
    console.log('\n2. Attempting to create connection...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: false,
      connectTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT)
    });

    console.log('Connection established successfully!');

    // 第三步：测试查询
    console.log('\n3. Testing query execution...');
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('Query executed successfully:', rows);

    // 第四步：关闭连接
    console.log('\n4. Closing connection...');
    await connection.end();
    console.log('Connection closed successfully');
    
  } catch (error) {
    console.error('\nConnection failed:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      syscall: error.syscall,
      hostname: error.hostname,
      stack: error.stack
    });
  }
}

// 执行测试
console.log('='.repeat(50));
console.log('Database Connection Test');
console.log('='.repeat(50));

testConnection(); 