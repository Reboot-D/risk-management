import { Router } from 'express';
import authRoutes from './auth.routes';
import dataRoutes from './data.routes';
import testRoutes from './test.routes';
import tradeRoutes from './trade.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/data', dataRoutes);
router.use('/test', testRoutes);
router.use('/trades', tradeRoutes);

export { router as routes }; 