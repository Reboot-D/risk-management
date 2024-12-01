import { Router } from 'express';
import { TradeController } from '../controllers/trade.controller';
import { upload } from '../middleware/upload';

const router = Router();

// 获取交易列表
router.get('/', TradeController.getTrades);

// 导入交易数据
router.post('/import', upload.single('file'), TradeController.importTrades);

// 导出交易数据
router.get('/export', TradeController.exportTrades);

export default router; 