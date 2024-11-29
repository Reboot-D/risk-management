import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'your-secret-key';

    try {
      const decoded = jwt.verify(token, secret);
      (req as any).user = decoded;
      next();
    } catch (error) {
      logger.error('Token verification failed:', error);
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token'
      });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
}; 