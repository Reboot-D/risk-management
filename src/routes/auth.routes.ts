import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.post('/login', AuthController.login);
router.get('/verify', AuthController.verify);
router.post('/logout', AuthController.logout);

export default router; 