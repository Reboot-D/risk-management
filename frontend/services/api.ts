import axios from 'axios';
import type { TradeInfo, ApiResponse } from '@/types/trade';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// 添加请求拦截器
api.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    console.log('Request:', config);
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器
api.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    console.log('Response:', response);
    return response;
  },
  (error) => {
    // 对响应错误做点什么
    console.error('Response Error:', error);
    if (error.response) {
      // 服务器返回了错误状态码
      console.error('Error Status:', error.response.status);
      console.error('Error Data:', error.response.data);
    } else if (error.request) {
      // 请求已经发出，但没有收到响应
      console.error('No Response Received');
    } else {
      // 设置请求时发生了错误
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// 交易相关 API
export const tradesApi = {
  // 获取交易列表
  getTrades: async (params = {}): Promise<ApiResponse<TradeInfo[]>> => {
    try {
      const response = await api.get('/trades', { 
        params,
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch trades:', error);
      throw error;
    }
  },

  // 创建新交易
  createTrade: async (trade: Omit<TradeInfo, 'id'>): Promise<ApiResponse<TradeInfo>> => {
    try {
      const response = await api.post('/trades', trade);
      return response.data;
    } catch (error) {
      console.error('Failed to create trade:', error);
      throw error;
    }
  },

  // 导出交易数据
  exportTrades: async (params = {}) => {
    try {
      const response = await api.get('/trades/export', {
        params,
        responseType: 'blob',
        headers: {
          Accept: 'text/csv',
        },
      });
      return response;
    } catch (error) {
      console.error('Failed to export trades:', error);
      throw error;
    }
  },
};

export default api; 