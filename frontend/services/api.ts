import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// 添加请求拦截器
api.interceptors.request.use(
  (config) => {
    // 如果是文件上传，不设置 Content-Type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 交易相关 API
export const tradesApi = {
  // 获取交易列表
  getTrades: async () => {
    try {
      const response = await api.get('/trades');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch trades:', error);
      throw error;
    }
  },

  // 导出交易数据
  exportTrades: async () => {
    try {
      const response = await api.get('/trades/export', {
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

  // 导入交易数据
  importTrades: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/trades/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to import trades:', error);
      throw error;
    }
  },
};

export default api; 