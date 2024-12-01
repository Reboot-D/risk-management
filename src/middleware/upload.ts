import multer from 'multer';
import { Request } from 'express';

// 配置内存存储
const storage = multer.memoryStorage();

// 文件过滤器
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // 只接受 CSV 文件
  if (
    file.mimetype === 'text/csv' ||
    file.mimetype === 'application/vnd.ms-excel' ||
    file.originalname.toLowerCase().endsWith('.csv')
  ) {
    cb(null, true);
  } else {
    cb(new Error('只支持上传 CSV 文件'));
  }
};

// 创建 multer 实例
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 限制文件大小为 5MB
    files: 1 // 一次只能上传一个文件
  },
}); 