import { Router } from 'express';
import pool from '../config/database';

const router = Router();

router.get('/test-db', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('SELECT 1 + 1 as result');
    connection.release();
    res.json({ status: 'success', data: result });
  } catch (error) {
    console.error('Test route error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 