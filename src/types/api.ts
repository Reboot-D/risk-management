// 通用响应接口
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
}

// 认证相关接口
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

// 数据管理相关接口
export interface RiskData {
  id?: number;
  type: string;
  level: string;
  description: string;
  source: string;
  status: string;
  timestamp?: Date;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
} 