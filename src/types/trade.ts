/**
 * 风险等级枚举
 * @description 定义交易相关的风险等级
 */
export enum RiskLevel {
  /** 高风险 */
  HIGH = 'high',
  /** 中风险 */
  MID = 'mid',
  /** 低风险 */
  LOW = 'low',
  /** 相关风险 */
  REL = 'rel'
}

/**
 * 交易商品分类枚举
 * @description 定义交易商品的基本分类
 */
export enum TradeChannelType {
  /** 实物商品 */
  PHYSICAL = 'physical',
  /** 虚拟商品 */
  VIRTUAL = 'virtual'
}

/**
 * 交易管控方式枚举
 * @description 定义交易的管控处理方式
 */
export enum TradeControlMethod {
  /** 交易拦截 */
  BLOCK = 'block',
  /** 交易校验 */
  VERIFY = 'verify',
  /** 交易放行 */
  PASS = 'pass'
}

/**
 * 基本交易信息接口
 * @description 定义交易数据的完整结构
 */
export interface TradeInfo {
  /** 交易ID */
  id?: number;
  
  // 基本交易信息
  /** 商户端创建订单的外网IP地址 */
  mc_create_trade_ip: string;
  /** 交易创单时间 */
  mcCreateTradeTime: Date;
  /** 交易商品分类（实物/虚拟） */
  mcCreateTradeChannelType: TradeChannelType;
  /** 交易商品分类渠道或内容 */
  mcCreateTradeChannel: string;
  /** 交易商品分类渠道的风险等级 */
  tradeChannelRiskLevel: RiskLevel;
  /** 是否资金保证金业务 */
  isFundFreezeBiz: 'Y' | 'N';
  
  // 外部账户信息
  /** 外部账户注册时间 */
  extraAccountRegTime: Date;
  /** 外部账户姓名（部分脱敏） */
  extraAccountName: string;
  /** 外部账户证件号（可加密） */
  extraAccountCertno: string;
  /** 外部账户证件号后6位（明文） */
  extraAccountCertnoLastSix: string;
  /** 外部账户手机号 */
  extraAccountPhone: string;
  /** 外部账户手机号后4位（明文） */
  extraAccountPhoneLastFour: string;
  /** 外部账户手机号账户绑定时间 */
  extraAccountPhoneRegTime: Date;
  /** 外部账户近30天登录设备数量 */
  loginDeviceQuantity: number;
  /** 外部账户关联支付宝买家ID */
  alipayUserCustomerId?: string;
  /** 外部账户ID（保持唯一性） */
  desensitizedUid: string;
  /** 外部账户风险等级 */
  extraAccountRiskLevel: RiskLevel;
  /** 外部账户业务等级 */
  extraAccountBusinessLevel: number;
  /** 外部账户业务等级判定原因 */
  extraAccountBusinessLevelReason?: string;
  
  // 被充值外部账号信息
  /** 被充值外部账号ID */
  chargedCardNumber: string;
  /** 被充值外部账号ID风险等级 */
  chargedCardNumberRiskLevel: RiskLevel;
  
  // 二级商户信息
  /** 订单收款外部商户ID */
  extraMerchantId: string;
  /** 外部商户风险等级 */
  extraMerchantRiskLevel: RiskLevel;
  
  // 其他信息
  /** 交易风险等级 */
  extraCreateTradeRiskLevel: RiskLevel;
  /** 交易管控商户建议方式 */
  extraCreateTradeControlMethod: TradeControlMethod;
  /** 借款类型 */
  loanType?: string;
  /** 分期数 */
  instalments?: number;
  /** 已还期数 */
  repaymentTimes?: number;
  
  // 系统字段
  /** 创建时间 */
  created_at?: Date;
  /** 更新时间 */
  updated_at?: Date;
}

/**
 * API 响应接口
 * @description 定义API响应的标准格式
 */
export interface ApiResponse<T = any> {
  /** 响应状态 */
  status: 'success' | 'error';
  /** 响应消息 */
  message?: string;
  /** 响应数据 */
  data?: T;
} 