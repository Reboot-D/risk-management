# 风险数据管理系统

## 项目概述
这是一个用于处理和管理风险数据的系统，支持数据的导入、导出、查看和分析。

## 技术栈
- 后端：Node.js + TypeScript + Express
- 数据库：MySQL (Tencent Cloud)
- 前端：React + TypeScript (开发中)

## 主要功能
1. 数据导入
   - 支持 CSV 文件导入
   - 智能数据清洗和格式转换
   - 灵活的数据验证

2. 数据处理
   - 自动据类型转换
   - 风险等级标准化
   - 数据脱敏处理

3. 数据导出
   - CSV 格式导出
   - 数据过滤和筛选
   - 自定义导出字段

## 项目结构
```
├── src/
│   ├── config/         # 配置文件
│   ├── controllers/    # 控制器
│   ├── models/         # 数据模型
│   ├── routes/         # 路由
│   └── index.ts        # 入口文件
├── frontend/           # 前端代码（开发中）
├── .env               # 环境变量
├── package.json       # 项目依赖
└── tsconfig.json      # TypeScript 配置
```

## 数据字段说明

### 基本交易信息
- mc_create_trade_ip: 商户端创建订单的外网IP地址
- mcCreateTradeTime: 交易创单时间
- mcCreateTradeChannelType: 交易商品分类（实物/虚拟）
- mcCreateTradeChannel: 交易商品分类渠道
- tradeChannelRiskLevel: 风险等级（high/mid/low/rel）
- isFundFreezeBiz: 是否资金保证金业务（Y/N）

### 外部账户信息
- extraAccountRegTime: 注册时间
- extraAccountName: 账户姓名
- extraAccountCertno: 证件号
- extraAccountPhone: 手机号
- extraAccountRiskLevel: 账户风险等级
- extraAccountBusinessLevel: 业务等级（1/2/3）

### 风险控制信息
- chargedCardNumberRiskLevel: 账号风险等级
- extraMerchantRiskLevel: 商户风险等级
- extraCreateTradeRiskLevel: 交易风险等级
- extraCreateTradeControlMethod: 管控方式

## 安装和运行

1. 安装依赖
```bash
npm install
```

2. 配置环境变量
复制 .env.example 到 .env 并填写配置：
```env
NODE_ENV=development
PORT=3001
DB_HOST=your-db-host
DB_PORT=your-db-port
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
```

3. 运行项目
```bash
npm start
```

## API 文档

### 数据导入
POST /api/trades/import
- 请求：multipart/form-data
- 文件字段：file (CSV)
- 响应：
  ```json
  {
    "status": "success",
    "total": 10,
    "success": 8,
    "failed": 2,
    "warnings": [],
    "errors": []
  }
  ```

### 数据导出
GET /api/trades/export
- 响应：CSV 文件

### 获取交易列表
GET /api/trades
- 响应：
  ```json
  {
    "status": "success",
    "data": [
      {
        "mc_create_trade_ip": "192.168.1.1",
        "mcCreateTradeTime": "2023-12-01 10:00:00",
        ...
      }
    ]
  }
  ```

## 数据验证规则

1. 日期时间格式
   - 支持多种格式：YYYY-MM-DD HH:mm:ss, YYYY/MM/DD, YYYY.MM.DD 等
   - 自动转换为标准格式

2. 风险等级
   - 支持多种表示：high/mid/low/rel
   - 支持中文：高/中/低/可信
   - 支持数字：3/2/1/0

3. 是否标志
   - 支持多种表示：Y/N, yes/no, true/false, 1/0
   - 支持中文：是/否

## 注意事项

1. 敏感数据处理
   - 证件号和手机号进行脱敏处理
   - 只保存必要的明文信息

2. 数据导入建议
   - 建议使用 UTF-8 编码的 CSV 文件
   - 建议保持字段名称一致
   - 大文件建议分批导入

## 后续开发计划

1. 前端界面
   - 数据可视化展示
   - 交互式数据筛选
   - 实时数据更新

2. 安全性增强
   - 数据加密传输
   - 访问权限控制
   - 操作日志记录

3. 功能扩展
   - 批量数据处理
   - 自定义数据规则
   - 风险预警系统

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证
MIT License