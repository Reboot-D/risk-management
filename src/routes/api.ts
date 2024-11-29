import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { DataController } from '../controllers/data.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// 认证相关路由
router.post('/auth/login', AuthController.login);
router.get('/auth/verify', authMiddleware, AuthController.verify);
router.post('/auth/logout', authMiddleware, AuthController.logout);

// 数据相关路由
router.get('/data', authMiddleware, DataController.getAllData);
router.get('/data/:id', authMiddleware, DataController.getData);
router.post('/data', authMiddleware, DataController.createData);
router.put('/data/:id', authMiddleware, DataController.updateData);
router.delete('/data/:id', authMiddleware, DataController.deleteData);

export default router; 