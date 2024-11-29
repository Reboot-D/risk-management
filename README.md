# 风险数据管理系统

一个基于 Node.js 和 React 的风险数据管理系统，用于处理和分析交易风险数据。

## 技术栈

### 后端
- Node.js
- Express
- TypeScript
- MySQL (腾讯云数据库)
- JWT 认证

### 前端
- React (Next.js)
- TypeScript
- Ant Design
- Axios

## 功能特性

- 交易数据管理
- 风险等级评估
- 数据可视化
- 实时数据更新
- 导出数据功能

## 开始使用

### 环境要求

- Node.js >= 14
- MySQL >= 8.0
- npm >= 6

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/Reboot-D/risk-management.git
cd risk-management
```

2. 安装依赖
```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd frontend
npm install
```

3. 配置环境变量
```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑 .env 文件，填入实际配置
```

4. 初始化数据库
```bash
npm run init-db
```

5. 启动服务
```bash
# 启动后端服务
npm run dev

# 启动前端服务
cd frontend
npm run dev
```

## 部署

### 后端部署
1. 构建项目
```bash
npm run build
```

2. 启动服务
```bash
npm start
```

### 前端部署
1. 构建项目
```bash
cd frontend
npm run build
```

2. 启动服务
```bash
npm start
```

## API 文档

### 认证接口
- POST /api/auth/login - 用户登录
- GET /api/auth/verify - 验证token
- POST /api/auth/logout - 用户登出

### 交易数据接口
- GET /api/trades - 获取交易列表
- POST /api/trades - 创建新交易
- GET /api/trades/export - 导出交易数据

## 安全说明

- 使用 JWT 进行身份认证
- 实现了 CORS 安全配置
- 使用 helmet 增强安全性
- 实现了速率限制
- 敏感数据加密存储

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

[MIT](LICENSE)

## 联系方式

- 作者：Reboot-D
- 邮箱：cardiffcr@gmail.com 