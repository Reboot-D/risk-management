import { Request, Response } from 'express';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';
import { insertTrade, getAllTrades } from '../models/trade.model';
import { RowDataPacket } from 'mysql2';
import moment from 'moment';

interface Trade {
  mc_create_trade_ip: string;
  mcCreateTradeTime: string;
  mcCreateTradeChannelType: string;
  mcCreateTradeChannel: string;
  tradeChannelRiskLevel: string;
  isFundFreezeBiz: string;
  extraAccountRegTime: string;
  extraAccountName: string;
  extraAccountCertno: string;
  extraAccountCertnoLastSix: string;
  extraAccountPhone: string;
  extraAccountPhoneLastFour: string;
  extraAccountPhoneRegTime: string;
  loginDeviceQuantity: number;
  alipayUserCustomerId: string;
  desensitizedUid: string;
  extraAccountRiskLevel: string;
  extraAccountBusinessLevel: string;
  extraAccountBusinessLevelReason: string;
  chargedCardNumber: string;
  chargedCardNumberRiskLevel: string;
  extraMerchantId: string;
  extraMerchantRiskLevel: string;
  extraCreateTradeRiskLevel: string;
  extraCreateTradeControlMethod: string;
  loanType: string;
  instalments: number;
  repaymentTimes: number;
  [key: string]: any;
}

export class TradeController {
  // 数据清洗和转换工具
  private static dataCleaningUtils = {
    // 清理和标准化日期时间
    cleanDateTime(value: any): string {
      if (!value) return moment().format('YYYY-MM-DD HH:mm:ss');
      
      // 尝试各种可能的日期格式
      const dateValue = moment(value, [
        'YYYY-MM-DD HH:mm:ss',
        'YYYY/MM/DD HH:mm:ss',
        'YYYY.MM.DD HH:mm:ss',
        'YYYYMMDDHHmmss',
        'YYYY-MM-DD',
        'YYYY/MM/DD',
        'YYYY.MM.DD',
        'YYYYMMDD',
        'DD-MM-YYYY',
        'DD/MM/YYYY',
        'MM-DD-YYYY',
        'MM/DD/YYYY'
      ], true);

      return dateValue.isValid() 
        ? dateValue.format('YYYY-MM-DD HH:mm:ss')
        : moment().format('YYYY-MM-DD HH:mm:ss');
    },

    // 清理和标准化渠道类型
    cleanChannelType(value: any): string {
      if (!value) return '虚拟';
      
      const physicalKeywords = ['实物', '实体', 'physical', 'real', 'tangible', 'goods'];
      const normalizedValue = String(value).toLowerCase().trim();
      
      return physicalKeywords.some(keyword => 
        normalizedValue.includes(keyword.toLowerCase())
      ) ? '实物' : '虚拟';
    },

    // 清理和标准化风险等级
    cleanRiskLevel(value: any): string {
      if (!value) return 'low';

      const riskMap: { [key: string]: string } = {
        'h': 'high', 'high': 'high', 'highest': 'high', '高': 'high', '3': 'high',
        'm': 'mid', 'mid': 'mid', 'middle': 'mid', 'medium': 'mid', '中': 'mid', '2': 'mid',
        'l': 'low', 'low': 'low', 'lowest': 'low', '低': 'low', '1': 'low',
        'r': 'rel', 'rel': 'rel', 'reliable': 'rel', '可信': 'rel', '0': 'rel'
      };

      const normalizedValue = String(value).toLowerCase().trim();
      
      for (const [key, mappedValue] of Object.entries(riskMap)) {
        if (normalizedValue.includes(key)) {
          return mappedValue;
        }
      }

      return 'low';
    },

    // 清理和标准化是否标志
    cleanYesNo(value: any): string {
      if (!value) return 'N';

      const yesValues = ['y', 'yes', 'true', '1', 't', '是', '真', 'yes', 'true'];
      const normalizedValue = String(value).toLowerCase().trim();

      return yesValues.some(v => normalizedValue.includes(v)) ? 'Y' : 'N';
    },

    // 清理和标准化数字
    cleanNumber(value: any): number {
      if (!value) return 0;

      const cleaned = String(value).replace(/[^0-9.-]/g, '');
      const number = parseInt(cleaned);
      return isNaN(number) ? 0 : number;
    },

    // 清理和标准化手机号
    cleanPhone(value: any): string {
      if (!value) return '';

      const cleaned = String(value).replace(/[^0-9]/g, '');
      return cleaned.slice(0, 11);
    },

    // 清理和标准化手机号后四位
    cleanPhoneLastFour(value: any, fullPhone: string): string {
      if (value) {
        return String(value).replace(/[^0-9]/g, '').slice(-4).padStart(4, '0');
      }
      if (fullPhone) {
        return fullPhone.slice(-4);
      }
      return '0000';
    },

    // 清理和标准化证件号后六位
    cleanCertNoLastSix(value: any, fullCertNo: string): string {
      if (value) {
        return String(value).replace(/[^0-9X]/g, '').slice(-6).padStart(6, '0');
      }
      if (fullCertNo) {
        return fullCertNo.slice(-6);
      }
      return '000000';
    },

    // 清理和标准化业务等级
    cleanBusinessLevel(value: any): string {
      if (!value) return '1';

      const level = parseInt(String(value).replace(/[^0-9]/g, ''));
      if (level >= 3) return '3';
      if (level >= 2) return '2';
      return '1';
    },

    // 清理和标准化交易控制方法
    cleanControlMethod(value: any): string {
      if (!value) return '交易校验';

      const normalizedValue = String(value).toLowerCase().trim();
      
      if (normalizedValue.includes('block') || normalizedValue.includes('拦截')) {
        return '交易拦截';
      }
      if (normalizedValue.includes('pass') || normalizedValue.includes('放行')) {
        return '交易放行';
      }
      return '交易校验';
    },

    // 清理和标准化字符串
    cleanString(value: any, maxLength: number = 100): string {
      if (!value) return '';
      return String(value).trim().slice(0, maxLength);
    }
  };

  // 获取交易列表
  static async getTrades(req: Request, res: Response) {
    try {
      const trades = await getAllTrades();
      res.json({
        status: 'success',
        data: trades
      });
    } catch (error) {
      console.error('获取交易列表失败：', error);
      res.status(500).json({ error: '获取交易列表失败' });
    }
  }

  // 导出交易数据
  static async exportTrades(req: Request, res: Response) {
    try {
      const trades = await getAllTrades() as Trade[];
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=trades_${new Date().toISOString()}.csv`);

      const stringifier = stringify({
        header: true,
        columns: Object.keys(trades[0] || {})
      });

      stringifier.pipe(res);
      trades.forEach((trade: Trade) => stringifier.write(trade));
      stringifier.end();

    } catch (error) {
      console.error('导出交易数据失败：', error);
      res.status(500).json({ error: '导出交易数据失败' });
    }
  }

  // 导入交易数据
  static async importTrades(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({ error: '请上传CSV文件' });
    }

    const results = {
      total: 0,
      success: 0,
      failed: 0,
      warnings: [] as any[],
      errors: [] as any[]
    };

    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relaxColumnCount: true, // 允许列数不一致
      relaxQuotes: true, // 允许引号不规范
      skipRecordsWithError: true // 跳过错误记录
    });

    parser.on('readable', async () => {
      let record;
      while ((record = parser.read())) {
        results.total++;
        try {
          const warnings: string[] = [];

          // 数据清洗和转换
          const tradeData: Trade = {
            // IP地址
            mc_create_trade_ip: this.dataCleaningUtils.cleanString(record.mc_create_trade_ip) || '0.0.0.0',

            // 日期时间字段
            mcCreateTradeTime: this.dataCleaningUtils.cleanDateTime(record.mcCreateTradeTime),
            extraAccountRegTime: this.dataCleaningUtils.cleanDateTime(record.extraAccountRegTime),
            extraAccountPhoneRegTime: this.dataCleaningUtils.cleanDateTime(record.extraAccountPhoneRegTime),

            // 渠道类型和风险等级
            mcCreateTradeChannelType: this.dataCleaningUtils.cleanChannelType(record.mcCreateTradeChannelType),
            mcCreateTradeChannel: this.dataCleaningUtils.cleanString(record.mcCreateTradeChannel, 50) || 'Unknown',
            tradeChannelRiskLevel: this.dataCleaningUtils.cleanRiskLevel(record.tradeChannelRiskLevel),
            
            // 是否标志
            isFundFreezeBiz: this.dataCleaningUtils.cleanYesNo(record.isFundFreezeBiz),

            // 账户信息
            extraAccountName: this.dataCleaningUtils.cleanString(record.extraAccountName) || '未知用户',
            extraAccountCertno: this.dataCleaningUtils.cleanString(record.extraAccountCertno) || '000000000000000000',
            extraAccountPhone: this.dataCleaningUtils.cleanPhone(record.extraAccountPhone),
            
            // 衍生信息
            extraAccountCertnoLastSix: this.dataCleaningUtils.cleanCertNoLastSix(
              record.extraAccountCertnoLastSix, 
              record.extraAccountCertno
            ),
            extraAccountPhoneLastFour: this.dataCleaningUtils.cleanPhoneLastFour(
              record.extraAccountPhoneLastFour,
              record.extraAccountPhone
            ),

            // 数字字段
            loginDeviceQuantity: this.dataCleaningUtils.cleanNumber(record.loginDeviceQuantity),
            instalments: this.dataCleaningUtils.cleanNumber(record.instalments),
            repaymentTimes: this.dataCleaningUtils.cleanNumber(record.repaymentTimes),

            // ID字段
            alipayUserCustomerId: this.dataCleaningUtils.cleanString(record.alipayUserCustomerId),
            desensitizedUid: this.dataCleaningUtils.cleanString(record.desensitizedUid) || `UID${Date.now()}`,
            chargedCardNumber: this.dataCleaningUtils.cleanString(record.chargedCardNumber) || `CARD${Date.now()}`,
            extraMerchantId: this.dataCleaningUtils.cleanString(record.extraMerchantId) || `MERCH${Date.now()}`,

            // 风险等级字段
            extraAccountRiskLevel: this.dataCleaningUtils.cleanRiskLevel(record.extraAccountRiskLevel),
            chargedCardNumberRiskLevel: this.dataCleaningUtils.cleanRiskLevel(record.chargedCardNumberRiskLevel),
            extraMerchantRiskLevel: this.dataCleaningUtils.cleanRiskLevel(record.extraMerchantRiskLevel),
            extraCreateTradeRiskLevel: this.dataCleaningUtils.cleanRiskLevel(record.extraCreateTradeRiskLevel),

            // 业务等级
            extraAccountBusinessLevel: this.dataCleaningUtils.cleanBusinessLevel(record.extraAccountBusinessLevel),
            extraAccountBusinessLevelReason: this.dataCleaningUtils.cleanString(record.extraAccountBusinessLevelReason),

            // 交易控制
            extraCreateTradeControlMethod: this.dataCleaningUtils.cleanControlMethod(record.extraCreateTradeControlMethod),
            loanType: this.dataCleaningUtils.cleanString(record.loanType, 50)
          };

          // 收集所有警告信息
          Object.entries(tradeData).forEach(([key, value]) => {
            if (value === null || value === '' || value === '0.0.0.0' || value.toString().includes('Unknown')) {
              warnings.push(`字段 ${key} 使用了默认值: ${value}`);
            }
          });

          await insertTrade(tradeData);
          results.success++;

          if (warnings.length > 0) {
            results.warnings.push({
              line: results.total,
              warnings: warnings
            });
          }

        } catch (error) {
          results.failed++;
          const errorMessage = error instanceof Error ? error.message : '数据处理失败';
          results.errors.push({
            line: results.total,
            data: record,
            error: errorMessage
          });
        }
      }
    });

    parser.on('error', (error) => {
      console.error('CSV解析错误：', error);
      res.status(500).json({ 
        error: 'CSV文件解析失败',
        details: error.message 
      });
    });

    parser.on('end', () => {
      res.json({
        status: 'success',
        total: results.total,
        success: results.success,
        failed: results.failed,
        warnings: results.warnings,
        errors: results.errors
      });
    });

    parser.write(req.file.buffer);
    parser.end();
  }
} 