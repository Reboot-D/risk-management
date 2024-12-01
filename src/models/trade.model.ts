import { pool } from '../config/db';

// 创建交易数据表
export async function createTradeTable() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS trades (
      id INT AUTO_INCREMENT PRIMARY KEY,
      mc_create_trade_ip VARCHAR(45) NOT NULL COMMENT '商户端创建订单的外网IP地址',
      mcCreateTradeTime DATETIME NOT NULL COMMENT '交易创单时间',
      mcCreateTradeChannelType ENUM('实物', '虚拟') NOT NULL COMMENT '交易商品分类',
      mcCreateTradeChannel VARCHAR(50) NOT NULL COMMENT '交易商品分类渠道',
      tradeChannelRiskLevel ENUM('high', 'mid', 'low', 'rel') NOT NULL COMMENT '交易商品分类渠道的风险等级',
      isFundFreezeBiz ENUM('Y', 'N') NOT NULL COMMENT '是否资金保证金业务',
      extraAccountRegTime DATETIME NOT NULL COMMENT '外部账户注册时间',
      extraAccountName VARCHAR(100) NOT NULL COMMENT '外部账户姓名',
      extraAccountCertno VARCHAR(255) NOT NULL COMMENT '外部账户证件号',
      extraAccountCertnoLastSix VARCHAR(6) NOT NULL COMMENT '外部账户证件号后6位',
      extraAccountPhone VARCHAR(255) NOT NULL COMMENT '外部账户手机号',
      extraAccountPhoneLastFour VARCHAR(4) NOT NULL COMMENT '外部账户手机号后4位',
      extraAccountPhoneRegTime DATETIME NOT NULL COMMENT '外部账户手机号账户绑定时间',
      loginDeviceQuantity INT NOT NULL COMMENT '外部账户近30天登录设备数量',
      alipayUserCustomerId VARCHAR(100) COMMENT '外部账户关联支付宝买家ID',
      desensitizedUid VARCHAR(100) NOT NULL COMMENT '外部账户ID',
      extraAccountRiskLevel ENUM('high', 'mid', 'low', 'rel') NOT NULL COMMENT '外部账户风险等级',
      extraAccountBusinessLevel ENUM('1', '2', '3') NOT NULL COMMENT '外部账户业务等级',
      extraAccountBusinessLevelReason TEXT COMMENT '外部账户业务等级判定原因',
      chargedCardNumber VARCHAR(100) NOT NULL COMMENT '被充值外部账号ID',
      chargedCardNumberRiskLevel ENUM('high', 'mid', 'low', 'rel') NOT NULL COMMENT '被充值外部账号ID风险等级',
      extraMerchantId VARCHAR(100) NOT NULL COMMENT '订单收款外部商户ID',
      extraMerchantRiskLevel ENUM('high', 'mid', 'low', 'rel') NOT NULL COMMENT '外部商户风险等级',
      extraCreateTradeRiskLevel ENUM('high', 'mid', 'low', 'rel') NOT NULL COMMENT '交易风险等级',
      extraCreateTradeControlMethod ENUM('交易拦截', '交易校验', '交易放行') NOT NULL COMMENT '交易管控商户建议方式',
      loanType VARCHAR(50) COMMENT '借款类型',
      instalments INT COMMENT '分期数',
      repaymentTimes INT COMMENT '已还期数',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_trade_time (mcCreateTradeTime),
      INDEX idx_risk_level (extraCreateTradeRiskLevel)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  try {
    await pool.query(createTableSQL);
    console.log('交易数据表创建成功');
    return true;
  } catch (error) {
    console.error('创建交易数据表失败：', error);
    return false;
  }
}

// 插入交易数据
export async function insertTrade(tradeData: any) {
  const sql = `
    INSERT INTO trades (
      mc_create_trade_ip, mcCreateTradeTime, mcCreateTradeChannelType,
      mcCreateTradeChannel, tradeChannelRiskLevel, isFundFreezeBiz,
      extraAccountRegTime, extraAccountName, extraAccountCertno,
      extraAccountCertnoLastSix, extraAccountPhone, extraAccountPhoneLastFour,
      extraAccountPhoneRegTime, loginDeviceQuantity, alipayUserCustomerId,
      desensitizedUid, extraAccountRiskLevel, extraAccountBusinessLevel,
      extraAccountBusinessLevelReason, chargedCardNumber, chargedCardNumberRiskLevel,
      extraMerchantId, extraMerchantRiskLevel, extraCreateTradeRiskLevel,
      extraCreateTradeControlMethod, loanType, instalments, repaymentTimes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await pool.query(sql, [
      tradeData.mc_create_trade_ip,
      tradeData.mcCreateTradeTime,
      tradeData.mcCreateTradeChannelType,
      tradeData.mcCreateTradeChannel,
      tradeData.tradeChannelRiskLevel,
      tradeData.isFundFreezeBiz,
      tradeData.extraAccountRegTime,
      tradeData.extraAccountName,
      tradeData.extraAccountCertno,
      tradeData.extraAccountCertnoLastSix,
      tradeData.extraAccountPhone,
      tradeData.extraAccountPhoneLastFour,
      tradeData.extraAccountPhoneRegTime,
      tradeData.loginDeviceQuantity,
      tradeData.alipayUserCustomerId,
      tradeData.desensitizedUid,
      tradeData.extraAccountRiskLevel,
      tradeData.extraAccountBusinessLevel,
      tradeData.extraAccountBusinessLevelReason,
      tradeData.chargedCardNumber,
      tradeData.chargedCardNumberRiskLevel,
      tradeData.extraMerchantId,
      tradeData.extraMerchantRiskLevel,
      tradeData.extraCreateTradeRiskLevel,
      tradeData.extraCreateTradeControlMethod,
      tradeData.loanType,
      tradeData.instalments,
      tradeData.repaymentTimes
    ]);
    return result;
  } catch (error) {
    console.error('插入交易数据失败：', error);
    throw error;
  }
}

// 获取所有交易数据
export async function getAllTrades() {
  try {
    const [rows] = await pool.query('SELECT * FROM trades ORDER BY mcCreateTradeTime DESC');
    return rows;
  } catch (error) {
    console.error('获取交易数据失败：', error);
    throw error;
  }
} 