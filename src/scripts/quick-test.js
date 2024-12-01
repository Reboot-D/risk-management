const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function quickTest() {
  let connection;
  try {
    console.log('配置信息:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    });
    
    console.log('尝试连接数据库...');
    
    // 创建连接
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '27323'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectTimeout: 60000
    });
    
    console.log('连接成功');
    
    // 创建数据库
    console.log('创建数据库...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`数据库 ${process.env.DB_NAME} 创建成功`);
    
    // 使用数据库
    await connection.query(`USE ${process.env.DB_NAME}`);
    console.log('切换到数据库成功');
    
    // 创建表
    console.log('创建表...');
    const createTableSQL = `
    CREATE TABLE IF NOT EXISTS trades (
      id INT AUTO_INCREMENT PRIMARY KEY,
      mc_create_trade_ip VARCHAR(45) NOT NULL COMMENT '商户端创建订单的外网IP地址',
      mcCreateTradeTime DATETIME NOT NULL COMMENT '交易创单时间',
      mcCreateTradeChannelType ENUM('physical', 'virtual') NOT NULL COMMENT '交易商品分类',
      mcCreateTradeChannel VARCHAR(100) NOT NULL COMMENT '交易商品分类渠道或内容',
      tradeChannelRiskLevel ENUM('high', 'mid', 'low', 'rel') NOT NULL COMMENT '交易商品分类渠道的风险等级',
      isFundFreezeBiz ENUM('Y', 'N') NOT NULL COMMENT '是否资金保证金业务',
      extraAccountRegTime DATETIME NOT NULL COMMENT '外部账户注册时间',
      extraAccountName VARCHAR(100) NOT NULL COMMENT '外部账户姓名',
      extraAccountCertno VARCHAR(255) NOT NULL COMMENT '外部账户证件号',
      extraAccountCertnoLastSix CHAR(6) NOT NULL COMMENT '外部账户证件号后6位',
      extraAccountPhone VARCHAR(255) NOT NULL COMMENT '外部账户手机号',
      extraAccountPhoneLastFour CHAR(4) NOT NULL COMMENT '外部账户手机号后4位',
      extraAccountPhoneRegTime DATETIME NOT NULL COMMENT '外部账户手机号账户绑定时间',
      loginDeviceQuantity INT NOT NULL COMMENT '外部账户近30天登录设备数量',
      alipayUserCustomerId VARCHAR(100) COMMENT '外部账户关联支付宝买家ID',
      desensitizedUid VARCHAR(100) NOT NULL COMMENT '外部账户ID',
      extraAccountRiskLevel ENUM('high', 'mid', 'low', 'rel') NOT NULL COMMENT '外部账户风险等级',
      extraAccountBusinessLevel INT NOT NULL COMMENT '外部账户业务等级',
      extraAccountBusinessLevelReason TEXT COMMENT '外部账户业务等级判定原因',
      chargedCardNumber VARCHAR(100) NOT NULL COMMENT '被充值外部账号ID',
      chargedCardNumberRiskLevel ENUM('high', 'mid', 'low', 'rel') NOT NULL COMMENT '被充值外部账号ID风险等级',
      extraMerchantId VARCHAR(100) NOT NULL COMMENT '订单收款外部商户ID',
      extraMerchantRiskLevel ENUM('high', 'mid', 'low', 'rel') NOT NULL COMMENT '外部商户风险等级',
      extraCreateTradeRiskLevel ENUM('high', 'mid', 'low', 'rel') NOT NULL COMMENT '交易风险等级',
      extraCreateTradeControlMethod ENUM('block', 'verify', 'pass') NOT NULL COMMENT '交易管控商户建议方式',
      loanType VARCHAR(50) COMMENT '借款类型',
      instalments INT COMMENT '分期数',
      repaymentTimes INT COMMENT '已还期数',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_trade_time (mcCreateTradeTime),
      INDEX idx_risk_level (extraCreateTradeRiskLevel),
      INDEX idx_merchant (extraMerchantId),
      INDEX idx_account (desensitizedUid)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    
    await connection.query(createTableSQL);
    console.log('表创建成功');
    
    // 验证表是否创建成功
    const [tables] = await connection.query('SHOW TABLES');
    console.log('数据库中的表:', tables);
    
    // 检查表结构
    const [columns] = await connection.query('DESCRIBE trades');
    console.log('trades表结构:', columns);
    
  } catch (error) {
    console.error('错误:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      syscall: error.syscall,
      hostname: error.hostname,
      stack: error.stack
    });
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n可能的解决方案:');
      console.error('1. 检查数据库服务器是否正在运行');
      console.error('2. 验证数据库主机名和端口是否正确');
      console.error('3. 确认防火墙设置是否允许连接');
      console.error('4. 检查安全组配置');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('连接已关闭');
    }
  }
}

quickTest(); 