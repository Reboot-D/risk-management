// 风险等级枚举
export enum RiskLevel {
  HIGH = 'high',
  MID = 'mid',
  LOW = 'low',
  REL = 'rel'
}

// 交易商品分类枚举
export enum TradeChannelType {
  PHYSICAL = 'physical',
  VIRTUAL = 'virtual'
}

// 交易控制方法枚举
export enum TradeControlMethod {
  BLOCK = 'block',
  VERIFY = 'verify',
  PASS = 'pass'
}

// 基本交易信息接口
export interface TradeInfo {
  id?: number;
  
  // 基本交易信息
  mc_create_trade_ip: string;
  mcCreateTradeTime: Date;
  mcCreateTradeChannelType: TradeChannelType;
  mcCreateTradeChannel: string;
  tradeChannelRiskLevel: RiskLevel;
  isFundFreezeBiz: 'Y' | 'N';
  
  // 外部账户信息
  extraAccountRegTime: Date;
  extraAccountName: string;
  extraAccountCertno: string;
  extraAccountCertnoLastSix: string;
  extraAccountPhone: string;
  extraAccountPhoneLastFour: string;
  extraAccountPhoneRegTime: Date;
  loginDeviceQuantity: number;
  alipayUserCustomerId?: string;
  desensitizedUid: string;
  extraAccountRiskLevel: RiskLevel;
  extraAccountBusinessLevel: number;
  extraAccountBusinessLevelReason?: string;
  
  // 被充值外部账号信息
  chargedCardNumber: string;
  chargedCardNumberRiskLevel: RiskLevel;
  
  // 二级商户信息
  extraMerchantId: string;
  extraMerchantRiskLevel: RiskLevel;
  
  // 其他信息
  extraCreateTradeRiskLevel: RiskLevel;
  extraCreateTradeControlMethod: 'block' | 'verify' | 'pass';
  loanType?: string;
  instalments?: number;
  repaymentTimes?: number;
}

// API 响应接口
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
} 