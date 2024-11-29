import { Router } from 'express';
import { TradeController } from '../controllers/trade.controller';

const router = Router();

// 获取交易列表
router.get('/', TradeController.getTrades);

// 导出交易数据
router.get('/export', TradeController.exportTrades);

// 创建新交易
router.post('/', TradeController.createTrade);

export default router; 