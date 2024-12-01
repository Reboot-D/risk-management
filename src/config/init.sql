-- 创建交易表
CREATE TABLE IF NOT EXISTS trades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  -- 基本交易信息
  mc_create_trade_ip VARCHAR(45) NOT NULL COMMENT '商户端创建订单的外网IP地址',
  mcCreateTradeTime DATETIME NOT NULL COMMENT '交易创单时间',
  mcCreateTradeChannelType ENUM('physical', 'virtual') NOT NULL COMMENT '交易商品分类',
  mcCreateTradeChannel VARCHAR(100) NOT NULL COMMENT '交易商品分类渠道或内容',
  tradeChannelRiskLevel ENUM('high', 'mid', 'low', 'rel') NOT NULL COMMENT '交易商品分类渠道的风险等级',
  isFundFreezeBiz ENUM('Y', 'N') NOT NULL COMMENT '是否资金保证金业务',
  
  -- 外部账户信息
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
  
  -- 被充值外部账号信息
  chargedCardNumber VARCHAR(100) NOT NULL COMMENT '被充值外部账号ID',
  chargedCardNumberRiskLevel ENUM('high', 'mid', 'low', 'rel') NOT NULL COMMENT '被充值外部账号ID风险等级',
  
  -- 二级商户信息
  extraMerchantId VARCHAR(100) NOT NULL COMMENT '订单收款外部商户ID',
  extraMerchantRiskLevel ENUM('high', 'mid', 'low', 'rel') NOT NULL COMMENT '外部商户风险等级',
  
  -- 其他信息
  extraCreateTradeRiskLevel ENUM('high', 'mid', 'low', 'rel') NOT NULL COMMENT '交易风险等级',
  extraCreateTradeControlMethod ENUM('block', 'verify', 'pass') NOT NULL COMMENT '交易管控商户建议方式',
  loanType VARCHAR(50) COMMENT '借款类型',
  instalments INT COMMENT '分期数',
  repaymentTimes INT COMMENT '已还期数',
  
  -- 系统字段
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_trade_time (mcCreateTradeTime),
  INDEX idx_risk_level (extraCreateTradeRiskLevel),
  INDEX idx_merchant (extraMerchantId),
  INDEX idx_account (desensitizedUid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 