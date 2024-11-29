import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { hash } from 'bcrypt';

dotenv.config();

const initDatabase = async () => {
  try {
    // 创建不指定数据库的连接
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    console.log('Connected to MySQL server');

    // 创建数据库
    await connection.query(`
      CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}
      DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `);

    console.log('Database created or already exists');

    // 使用新创建的数据库
    await connection.query(`USE ${process.env.DB_NAME}`);

    // 创建用户表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 创建风险数据表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS risk_data (
        id INT PRIMARY KEY AUTO_INCREMENT,
        type VARCHAR(50) NOT NULL,
        level ENUM('low', 'medium', 'high') NOT NULL,
        description TEXT NOT NULL,
        source VARCHAR(100) NOT NULL,
        status ENUM('pending', 'processed', 'archived') NOT NULL DEFAULT 'pending',
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log('Tables created successfully');

    // 创建管理员用户
    const hashedPassword = await hash('admin123', 10);
    await connection.query(`
      INSERT IGNORE INTO users (username, password, role)
      VALUES (?, ?, ?)
    `, ['admin', hashedPassword, 'admin']);

    console.log('Admin user created or already exists');

    await connection.end();
    console.log('Database initialization completed successfully');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
};

initDatabase().then(success => {
  process.exit(success ? 0 : 1);
});
