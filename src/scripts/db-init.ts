import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 验证环境变量
function validateEnvVariables() {
  const requiredVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`缺少必要的环境变量: ${missingVars.join(', ')}`);
  }
}

async function initializeDatabase() {
  let connection;
  try {
    console.log('\n=== 数据库初始化开始 ===');
    
    // 验证环境变量
    console.log('0. 验证环境变量...');
    validateEnvVariables();
    console.log('环境变量验证通过');
    
    // 1. 建立连接
    console.log('1. 建立数据库连接...');
    console.log('连接配置:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    });
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '27323'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: undefined,
      connectTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '60000')
    });
    console.log('数据库连接成功');
    
    // 2. 创建数据库（如果不存在）
    console.log('2. 创建数据库...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`数据库 ${process.env.DB_NAME} 创建成功或已存在`);
    
    // 3. 使用数据库
    console.log('3. 切换到目标数据库...');
    await connection.query(`USE ${process.env.DB_NAME}`);
    console.log(`已切换到数据库: ${process.env.DB_NAME}`);
    
    // 4. 读取并执行初始化SQL脚本
    console.log('4. 执行初始化SQL脚本...');
    const sqlPath = path.join(__dirname, '../config/init.sql');
    console.log('SQL文件路径:', sqlPath);
    
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`SQL文件不存在: ${sqlPath}`);
    }
    
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    console.log('SQL文件读取成功，长度:', sqlContent.length);
    
    // 分割SQL语句（按分号分割，忽略注释）
    const statements = sqlContent
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    console.log(`找到 ${statements.length} 条SQL语句`);
    
    // 逐条执行SQL语句
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        console.log(`执行第 ${i + 1}/${statements.length} 条SQL语句:`, statement.substring(0, 50) + '...');
        await connection.query(statement);
        console.log(`第 ${i + 1} 条SQL语句执行成功`);
      } catch (error: any) {
        console.error(`第 ${i + 1} 条SQL语句执行失败:`, statement.substring(0, 50) + '...');
        console.error('错误信息:', error.message);
        throw error;
      }
    }
    
    // 5. 验证表是否创建成功
    console.log('5. 验证数据库表...');
    const [tables] = await connection.query('SHOW TABLES');
    console.log('已创建的表:', tables);
    
    // 6. 验证表结构
    console.log('6. 验证表结构...');
    const [columns] = await connection.query('SHOW COLUMNS FROM trades');
    console.log('trades表结构:', columns);
    
    console.log('\n=== 数据库初始化完成 ===');
    return true;
    
  } catch (error: any) {
    console.error('\n=== 数据库初始化失败 ===');
    console.error('错误详情:', {
      错误代码: error.code,
      错误消息: error.message,
      堆栈: error.stack
    });
    
    // 根据错误类型提供具体建议
    if (error.code === 'ECONNREFUSED') {
      console.error('\n可能的解决方案:');
      console.error('1. 检查数据库服务器是否正在运行');
      console.error('2. 验证数据库主机名和端口是否正确');
      console.error('3. 确认防火墙设置是否允许连接');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n可能的解决方案:');
      console.error('1. 检查数据库用户名和密码是否正确');
      console.error('2. 确认用户是否有足够的权限');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n可能的解决方案:');
      console.error('1. 检查数据库名称是否正确');
      console.error('2. 确认数据库是否已创建');
    }
    
    return false;
    
  } finally {
    if (connection) {
      await connection.end();
      console.log('数据库连接已关闭');
    }
  }
}

// 执行初始化
initializeDatabase().then(success => {
  if (success) {
    console.log('数据库初始化成功完成');
    process.exit(0);
  } else {
    console.error('数据库初始化失败');
    process.exit(1);
  }
}); 