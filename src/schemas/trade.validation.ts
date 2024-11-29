import { z } from 'zod';
import { RiskLevel, TradeChannelType, TradeControlMethod } from '../types/trade';

// 基本验证规则
const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

// 创建交易的验证模式
export const createTradeSchema = z.object({
  // 基本交易信息
  mc_create_trade_ip: z.string().regex(ipv4Regex).or(z.string().regex(ipv6Regex)),
  mc_create_trade_time: z.string().datetime(),
  mc_create_trade_channel_type: z.nativeEnum(TradeChannelType),
  mc_create_trade_channel: z.string().min(1).max(50),
  trade_channel_risk_level: z.nativeEnum(RiskLevel),
  is_fund_freeze_biz: z.enum(['Y', 'N']),

  // 外部账户信息
  extra_account_reg_time: z.string().datetime(),
  extra_account_name: z.string().min(1).max(255),
  extra_account_certno: z.string().min(1),
  extra_account_certno_last_six: z.string().length(6),
  extra_account_phone: z.string().min(1),
  extra_account_phone_last_four: z.string().length(4),
  extra_account_phone_reg_time: z.string().datetime(),
  login_device_quantity: z.number().int().min(0),
  alipay_user_customer_id: z.string().optional(),
  desensitized_uid: z.string().min(1).max(64),
  extra_account_risk_level: z.nativeEnum(RiskLevel),
  extra_account_business_level: z.number().int().min(1).max(10),
  extra_account_business_level_reason: z.string().optional(),

  // 被充值外部账号信息
  charged_card_number: z.string().min(1).max(64),
  charged_card_number_risk_level: z.nativeEnum(RiskLevel),

  // 二级商户信息
  extra_merchant_id: z.string().min(1).max(64),
  extra_merchant_risk_level: z.nativeEnum(RiskLevel),

  // 其他信息
  extra_create_trade_risk_level: z.nativeEnum(RiskLevel),
  extra_create_trade_control_method: z.nativeEnum(TradeControlMethod),
  loan_type: z.string().optional(),
  instalments: z.number().int().min(1).max(12).optional(),
  repayment_times: z.number().int().min(0).optional()
});

// 更新交易的验证模式
export const updateTradeSchema = createTradeSchema.partial().extend({
  id: z.number().int().positive()
});

// 查询过滤条件的验证模式
export const tradeFilterSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  riskLevel: z.nativeEnum(RiskLevel).optional(),
  merchantId: z.string().min(1).max(64).optional(),
  userId: z.string().min(1).max(64).optional(),
  cardNumber: z.string().min(1).max(64).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional()
});

export type CreateTradeSchema = z.infer<typeof createTradeSchema>;
export type UpdateTradeSchema = z.infer<typeof updateTradeSchema>;
export type TradeFilterSchema = z.infer<typeof tradeFilterSchema>; 