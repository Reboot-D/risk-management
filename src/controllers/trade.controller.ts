import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import pool from '../config/database';
import { Parser } from 'json2csv';

export class TradeController {
  // 获取交易列表
  static async getTrades(req: Request, res: Response) {
    try {
      const {
        dateRange,
        mcCreateTradeChannel,
        extraCreateTradeRiskLevel,
        extraAccountName,
        chargedCardNumber,
      } = req.query;

      let query = 'SELECT * FROM trades WHERE 1=1';
      const params: any[] = [];

      // 构建查询条件
      if (dateRange) {
        const { start, end } = dateRange as any;
        if (start && end) {
          query += ' AND mcCreateTradeTime BETWEEN ? AND ?';
          params.push(start, end);
        }
      }

      if (mcCreateTradeChannel) {
        query += ' AND mcCreateTradeChannel LIKE ?';
        params.push(`%${mcCreateTradeChannel}%`);
      }

      if (extraCreateTradeRiskLevel) {
        query += ' AND extraCreateTradeRiskLevel = ?';
        params.push(extraCreateTradeRiskLevel);
      }

      if (extraAccountName) {
        query += ' AND extraAccountName LIKE ?';
        params.push(`%${extraAccountName}%`);
      }

      if (chargedCardNumber) {
        query += ' AND chargedCardNumber LIKE ?';
        params.push(`%${chargedCardNumber}%`);
      }

      // 执行查询
      const [rows] = await pool.execute(query, params);

      res.json({
        status: 'success',
        data: rows,
      });
    } catch (error) {
      logger.error('Get trades error:', error);
      res.status(500).json({
        status: 'error',
        message: '获取交易数据失败',
      });
    }
  }

  // 创建新交易
  static async createTrade(req: Request, res: Response) {
    try {
      const tradeData = req.body;

      // 插入数据
      const [result] = await pool.execute(
        'INSERT INTO trades SET ?',
        [tradeData]
      );

      res.json({
        status: 'success',
        message: '交易创建成功',
        data: {
          id: (result as any).insertId,
          ...tradeData,
        },
      });
    } catch (error) {
      logger.error('Create trade error:', error);
      res.status(500).json({
        status: 'error',
        message: '创建交易失败',
      });
    }
  }

  // 导出交易数据
  static async exportTrades(req: Request, res: Response) {
    try {
      const {
        dateRange,
        mcCreateTradeChannel,
        extraCreateTradeRiskLevel,
        extraAccountName,
        chargedCardNumber,
      } = req.query;

      let query = 'SELECT * FROM trades WHERE 1=1';
      const params: any[] = [];

      // 构建查询条件
      if (dateRange) {
        const { start, end } = dateRange as any;
        if (start && end) {
          query += ' AND mcCreateTradeTime BETWEEN ? AND ?';
          params.push(start, end);
        }
      }

      if (mcCreateTradeChannel) {
        query += ' AND mcCreateTradeChannel LIKE ?';
        params.push(`%${mcCreateTradeChannel}%`);
      }

      if (extraCreateTradeRiskLevel) {
        query += ' AND extraCreateTradeRiskLevel = ?';
        params.push(extraCreateTradeRiskLevel);
      }

      if (extraAccountName) {
        query += ' AND extraAccountName LIKE ?';
        params.push(`%${extraAccountName}%`);
      }

      if (chargedCardNumber) {
        query += ' AND chargedCardNumber LIKE ?';
        params.push(`%${chargedCardNumber}%`);
      }

      // 执行查询
      const [rows] = await pool.execute(query, params);

      // 转换为 CSV
      const fields = [
        'mcCreateTradeTime',
        'mcCreateTradeChannel',
        'extraAccountName',
        'extraCreateTradeRiskLevel',
        'chargedCardNumber',
      ];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(rows);

      // 设置响应头
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=trades.csv'
      );

      res.send(csv);
    } catch (error) {
      logger.error('Export trades error:', error);
      res.status(500).json({
        status: 'error',
        message: '导出交易数据失败',
      });
    }
  }
} 