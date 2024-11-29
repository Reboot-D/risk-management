import { RiskLevel, TradeChannelType, TradeControlMethod, TradeInfo } from '../types/trade';

describe('Trade Types', () => {
  test('RiskLevel enum should have correct values', () => {
    expect(RiskLevel.HIGH).toBe('high');
    expect(RiskLevel.MID).toBe('mid');
    expect(RiskLevel.LOW).toBe('low');
    expect(RiskLevel.REL).toBe('rel');
  });

  test('TradeChannelType enum should have correct values', () => {
    expect(TradeChannelType.PHYSICAL).toBe('physical');
    expect(TradeChannelType.VIRTUAL).toBe('virtual');
  });

  test('TradeControlMethod enum should have correct values', () => {
    expect(TradeControlMethod.BLOCK).toBe('block');
    expect(TradeControlMethod.VERIFY).toBe('verify');
    expect(TradeControlMethod.PASS).toBe('pass');
  });
});

describe('Trade Data Validation', () => {
  const mockTradeData: TradeInfo = {
    mc_create_trade_ip: '192.168.1.1',
    mcCreateTradeTime: new Date(),
    mcCreateTradeChannelType: TradeChannelType.PHYSICAL,
    mcCreateTradeChannel: '实物商品',
    tradeChannelRiskLevel: RiskLevel.LOW,
    isFundFreezeBiz: 'N',
    
    extraAccountRegTime: new Date(),
    extraAccountName: '张**',
    extraAccountCertno: 'encrypted_data',
    extraAccountCertnoLastSix: '123456',
    extraAccountPhone: 'encrypted_data',
    extraAccountPhoneLastFour: '5678',
    extraAccountPhoneRegTime: new Date(),
    loginDeviceQuantity: 2,
    desensitizedUid: 'user123',
    extraAccountRiskLevel: RiskLevel.LOW,
    extraAccountBusinessLevel: 1,
    
    chargedCardNumber: 'card123',
    chargedCardNumberRiskLevel: RiskLevel.LOW,
    
    extraMerchantId: 'merchant123',
    extraMerchantRiskLevel: RiskLevel.LOW,
    
    extraCreateTradeRiskLevel: RiskLevel.LOW,
    extraCreateTradeControlMethod: TradeControlMethod.PASS
  };

  test('Trade data should have required fields', () => {
    expect(mockTradeData).toHaveProperty('mc_create_trade_ip');
    expect(mockTradeData).toHaveProperty('mcCreateTradeTime');
    expect(mockTradeData).toHaveProperty('mcCreateTradeChannelType');
    expect(mockTradeData).toHaveProperty('extraAccountRiskLevel');
  });

  test('Trade data should have valid risk levels', () => {
    expect(Object.values(RiskLevel)).toContain(mockTradeData.tradeChannelRiskLevel);
    expect(Object.values(RiskLevel)).toContain(mockTradeData.extraAccountRiskLevel);
    expect(Object.values(RiskLevel)).toContain(mockTradeData.chargedCardNumberRiskLevel);
    expect(Object.values(RiskLevel)).toContain(mockTradeData.extraMerchantRiskLevel);
    expect(Object.values(RiskLevel)).toContain(mockTradeData.extraCreateTradeRiskLevel);
  });

  test('Trade data should have valid control method', () => {
    expect(Object.values(TradeControlMethod)).toContain(mockTradeData.extraCreateTradeControlMethod);
  });

  test('Trade data should have valid channel type', () => {
    expect(Object.values(TradeChannelType)).toContain(mockTradeData.mcCreateTradeChannelType);
  });
}); 