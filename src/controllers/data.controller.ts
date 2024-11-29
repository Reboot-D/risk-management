import { Request, Response } from 'express';
import pool from '../config/database';
import { logger } from '../utils/logger';
import { RiskData, ApiResponse } from '../types/api';

export class DataController {
  static async getAllData(req: Request, res: Response<ApiResponse<RiskData[]>>) {
    try {
      const [rows] = await pool.query('SELECT * FROM risk_data');
      return res.json({
        status: 'success',
        data: rows as RiskData[]
      });
    } catch (error) {
      logger.error('Error fetching all data:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch data'
      });
    }
  }

  static async getData(req: Request, res: Response<ApiResponse<RiskData>>) {
    try {
      const { id } = req.params;
      const [rows] = await pool.query('SELECT * FROM risk_data WHERE id = ?', [id]);
      const data = rows as RiskData[];
      
      if (data.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Data not found'
        });
      }

      return res.json({
        status: 'success',
        data: data[0]
      });
    } catch (error) {
      logger.error('Error fetching data:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch data'
      });
    }
  }

  static async createData(req: Request, res: Response<ApiResponse<RiskData>>) {
    try {
      const data: RiskData = req.body;
      const [result] = await pool.query('INSERT INTO risk_data SET ?', [data]);
      const insertId = (result as any).insertId;

      return res.status(201).json({
        status: 'success',
        data: { id: insertId, ...data } as RiskData
      });
    } catch (error) {
      logger.error('Error creating data:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create data'
      });
    }
  }

  static async updateData(req: Request, res: Response<ApiResponse<RiskData>>) {
    try {
      const { id } = req.params;
      const data: Partial<RiskData> = req.body;

      const [result] = await pool.query('UPDATE risk_data SET ? WHERE id = ?', [data, id]);
      
      if ((result as any).affectedRows === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Data not found'
        });
      }

      const [updatedRows] = await pool.query('SELECT * FROM risk_data WHERE id = ?', [id]);
      const updatedData = (updatedRows as any[])[0];

      return res.json({
        status: 'success',
        data: updatedData
      });
    } catch (error) {
      logger.error('Error updating data:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update data'
      });
    }
  }

  static async deleteData(req: Request, res: Response<ApiResponse<void>>) {
    try {
      const { id } = req.params;
      const [result] = await pool.query('DELETE FROM risk_data WHERE id = ?', [id]);

      if ((result as any).affectedRows === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Data not found'
        });
      }

      return res.json({
        status: 'success',
        message: 'Data deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting data:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete data'
      });
    }
  }
} 