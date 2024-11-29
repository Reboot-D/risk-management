import { Request, Response } from 'express';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { logger } from '../utils/logger';
import { LoginRequest, ApiResponse, LoginResponse } from '../types/api';

export class AuthController {
  static async login(req: Request<{}, {}, LoginRequest>, res: Response<ApiResponse<LoginResponse>>) {
    const { username, password } = req.body;

    try {
      const [rows]: any = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      const user = rows[0];
      if (!user || !(await compare(password, user.password))) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid credentials'
        });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      logger.info(`User logged in: ${username}`);
      
      return res.json({
        status: 'success',
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }

  static async verify(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      
      return res.json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      logger.error('Verify error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }

  static async logout(req: Request, res: Response) {
    return res.json({
      status: 'success',
      message: 'Logged out successfully'
    });
  }
} 