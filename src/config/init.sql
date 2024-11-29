-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 创建风险数据表
CREATE TABLE IF NOT EXISTS risk_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  level ENUM('low', 'medium', 'high', 'critical') NOT NULL,
  description TEXT NOT NULL,
  source VARCHAR(100) NOT NULL,
  status ENUM('pending', 'processing', 'resolved', 'archived') NOT NULL DEFAULT 'pending',
  created_by INT,
  assigned_to INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 创建审计日志表
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT NOT NULL,
  changes JSON,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 创建默认管理员用户（密码需要在应用程序中通过 bcrypt 加密）
INSERT IGNORE INTO users (username, password, role) 
VALUES ('admin', '$2b$10$your_hashed_password', 'admin');

-- 创建交易信息表
CREATE TABLE IF NOT EXISTS trade_info (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  
  -- 一、基本交易信息
  mc_create_trade_ip VARCHAR(45) NOT NULL COMMENT '商户端创建订单的外网IP地址',
  mc_create_trade_time DATETIME NOT NULL COMMENT '交易创单时间',
  mc_create_trade_channel_type ENUM('physical', 'virtual') NOT NULL COMMENT '交易商品分类',
  mc_create_trade_channel VARCHAR(50) NOT NULL COMMENT '交易商品分类渠道',
  trade_channel_risk_level ENUM('high', 'mid', 'low', 'rel') NOT NULL COMMENT '交易商品分类渠道风险等级',
  is_fund_freeze_biz ENUM('Y', 'N') NOT NULL COMMENT '是否资金保证金业务',
  
  -- 二、外部账户信息
  extra_account_reg_time DATETIME NOT NULL COMMENT '外部账户注册时间',
  extra_account_name VARCHAR(255) NOT NULL COMMENT '外部账户姓名(脱敏)',
  extra_account_certno VARCHAR(255) NOT NULL COMMENT '外部账户证件号(加密)',
  extra_account_certno_last_six CHAR(6) NOT NULL COMMENT '外部账户证件号后6位',
  extra_account_phone VARCHAR(255) NOT NULL COMMENT '外部账户手机号',
  extra_account_phone_last_four CHAR(4) NOT NULL COMMENT '外部账户手机号后4位',
  extra_account_phone_reg_time DATETIME NOT NULL COMMENT '外部账户手机号绑定时间',
  login_device_quantity INT NOT NULL COMMENT '近30天登录设备数量',
  alipay_user_customer_id VARCHAR(64) COMMENT '关联支付宝买家ID',
  desensitized_uid VARCHAR(64) NOT NULL COMMENT '外部账户ID',
  extra_account_risk_level ENUM('high', 'mid', 'low', 'rel') NOT NULL COMMENT '外部账户风险等级',
  extra_account_business_level TINYINT NOT NULL COMMENT '外部账户业务等级',
  extra_account_business_level_reason TEXT COMMENT '外部账户业务等级判定原因',
  
  -- 三、被充值外部账号信息
  charged_card_number VARCHAR(64) NOT NULL COMMENT '被充值外部账号ID',
  charged_card_number_risk_level ENUM('high', 'mid', 'low', 'rel') NOT NULL COMMENT '被充值外部账号风险等级',
  
  -- 四、二级商户信息
  extra_merchant_id VARCHAR(64) NOT NULL COMMENT '订单收款外部商户ID',
  extra_merchant_risk_level ENUM('high', 'mid', 'low', 'rel') NOT NULL COMMENT '外部商户风险等级',
  
  -- 五、其他信息
  extra_create_trade_risk_level ENUM('high', 'mid', 'low', 'rel') NOT NULL COMMENT '交易风险等级',
  extra_create_trade_control_method ENUM('block', 'verify', 'pass') NOT NULL COMMENT '交易管控建议方式',
  loan_type VARCHAR(50) COMMENT '借款类型',
  instalments TINYINT COMMENT '分期数',
  repayment_times TINYINT COMMENT '已还期数',
  
  -- 系统字段
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录更新时间',
  
  -- 索引
  INDEX idx_trade_time (mc_create_trade_time),
  INDEX idx_risk_level (extra_create_trade_risk_level),
  INDEX idx_merchant (extra_merchant_id),
  INDEX idx_user (desensitized_uid),
  INDEX idx_card (charged_card_number),
  
  -- 约束
  CONSTRAINT chk_instalments CHECK (instalments IN (1,3,6,9,12)),
  CONSTRAINT chk_repayment_times CHECK (repayment_times <= instalments)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建数据加密函数
DELIMITER //
CREATE FUNCTION IF NOT EXISTS encrypt_data(data VARCHAR(255))
RETURNS VARCHAR(255) DETERMINISTIC
BEGIN
  RETURN SHA2(data, 256);
END //
DELIMITER ;

-- 创建触发器，在插入数据时自动加密敏感信息
DELIMITER //
CREATE TRIGGER IF NOT EXISTS encrypt_sensitive_data_before_insert
BEFORE INSERT ON trade_info
FOR EACH ROW
BEGIN
  SET NEW.extra_account_certno = encrypt_data(NEW.extra_account_certno);
  SET NEW.extra_account_phone = encrypt_data(NEW.extra_account_phone);
END //
DELIMITER ;

-- 创建交易数据表
CREATE TABLE IF NOT EXISTS trades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  -- 基本交易信息
  mc_create_trade_ip VARCHAR(45) NOT NULL,
  mcCreateTradeTime DATETIME NOT NULL,
  mcCreateTradeChannelType ENUM('physical', 'virtual') NOT NULL,
  mcCreateTradeChannel VARCHAR(100) NOT NULL,
  tradeChannelRiskLevel ENUM('high', 'mid', 'low', 'rel') NOT NULL,
  isFundFreezeBiz ENUM('Y', 'N') NOT NULL,
  
  -- 外部账户信息
  extraAccountRegTime DATETIME NOT NULL,
  extraAccountName VARCHAR(100) NOT NULL,
  extraAccountCertno VARCHAR(255) NOT NULL,
  extraAccountCertnoLastSix CHAR(6) NOT NULL,
  extraAccountPhone VARCHAR(20) NOT NULL,
  extraAccountPhoneLastFour CHAR(4) NOT NULL,
  extraAccountPhoneRegTime DATETIME NOT NULL,
  loginDeviceQuantity INT NOT NULL,
  alipayUserCustomerId VARCHAR(100),
  desensitizedUid VARCHAR(100) NOT NULL,
  extraAccountRiskLevel ENUM('high', 'mid', 'low', 'rel') NOT NULL,
  extraAccountBusinessLevel INT NOT NULL,
  extraAccountBusinessLevelReason TEXT,
  
  -- 被充值外部账号信息
  chargedCardNumber VARCHAR(100) NOT NULL,
  chargedCardNumberRiskLevel ENUM('high', 'mid', 'low', 'rel') NOT NULL,
  
  -- 二级商户信息
  extraMerchantId VARCHAR(100) NOT NULL,
  extraMerchantRiskLevel ENUM('high', 'mid', 'low', 'rel') NOT NULL,
  
  -- 其他信息
  extraCreateTradeRiskLevel ENUM('high', 'mid', 'low', 'rel') NOT NULL,
  extraCreateTradeControlMethod ENUM('block', 'verify', 'pass') NOT NULL,
  loanType ENUM('consumer', 'cash', 'business'),
  instalments INT,
  repaymentTimes INT,
  
  -- 系统字段
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_trade_time (mcCreateTradeTime),
  INDEX idx_risk_level (extraCreateTradeRiskLevel),
  INDEX idx_merchant (extraMerchantId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 