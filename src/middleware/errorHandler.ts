import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// 自定义错误类
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 开发环境错误响应
const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

// 生产环境错误响应
const sendErrorProd = (err: AppError, res: Response) => {
  // 可操作的错误：发送给客户端
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // 编程错误：不泄露错误详情
    logger.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: '服务器内部错误'
    });
  }
};

// 处理特定类型的错误
const handleJWTError = () => new AppError('无效的令牌', 401);
const handleJWTExpiredError = () => new AppError('令牌已过期', 401);
const handleValidationError = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `无效的输入数据: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (error.name === 'ValidationError') error = handleValidationError(error);

    sendErrorProd(error, res);
  }
}; 