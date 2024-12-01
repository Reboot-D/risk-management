import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('开始测试数据库连接...');
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '27323'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: false
      }
    });

    console.log('成功建立连接！');

    // 修改字段类型
    console.log('修改 mcCreateTradeChannelType 字段类型...');
    await connection.query(`
      ALTER TABLE trades 
      MODIFY COLUMN mcCreateTradeChannelType VARCHAR(20) NOT NULL 
      COMMENT '交易商品分类';
    `);
    console.log('字段类型修改成功！');

    // 检查trades表结构
    const [columns] = await connection.query('DESCRIBE trades');
    console.log('trades表结构:', columns);

    await connection.end();
    console.log('连接测试完成！');
  } catch (error: any) {
    console.error('操作失败:', error);
  }
}

testConnection(); 