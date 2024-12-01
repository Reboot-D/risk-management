'use client';

import { useState } from 'react';
import { Card, Row, Col, Statistic, Switch, Alert, Table, Tag, Button, Space } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import AppLayout from '@/components/layout/AppLayout';
import { RiskLevel } from '@/types/trade';

// 模拟数据
const mockTrendData = [
  { time: '00:00', high: 12, medium: 24, low: 35 },
  { time: '04:00', high: 15, medium: 28, low: 38 },
  { time: '08:00', high: 20, medium: 32, low: 42 },
  { time: '12:00', high: 18, medium: 30, low: 40 },
  { time: '16:00', high: 22, medium: 35, low: 45 },
  { time: '20:00', high: 16, medium: 26, low: 36 },
];

const mockAlerts = [
  {
    id: 1,
    time: '2024-02-20 10:30:25',
    type: 'high',
    description: '检测到异常登录行为',
    status: 'pending'
  },
  {
    id: 2,
    time: '2024-02-20 10:28:15',
    type: 'medium',
    description: '交易金额超过阈值',
    status: 'resolved'
  },
  // 添加更多模拟数据...
];

export default function RiskPage() {
  const [autoAlert, setAutoAlert] = useState(true);
  const [loading, setLoading] = useState(false);

  const alertColumns = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 180,
    },
    {
      title: '风险等级',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const colors = {
          high: 'red',
          medium: 'orange',
          low: 'green'
        };
        const texts = {
          high: '高风险',
          medium: '中风险',
          low: '低风险'
        };
        return (
          <Tag color={colors[type as keyof typeof colors]}>
            {texts[type as keyof typeof texts]}
          </Tag>
        );
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={status === 'pending' ? 'volcano' : 'success'}>
          {status === 'pending' ? '待处理' : '已解决'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="link" size="small">
            处理
          </Button>
          <Button type="link" size="small">
            详情
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <AppLayout>
      {/* 风险概览 */}
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="高风险交易"
              value={28}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ExclamationCircleOutlined />}
              suffix="笔"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="中风险交易"
              value={156}
              valueStyle={{ color: '#faad14' }}
              prefix={<ExclamationCircleOutlined />}
              suffix="笔"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="低风险交易"
              value={521}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
              suffix="笔"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="风险拦截率"
              value={95.8}
              precision={1}
              valueStyle={{ color: '#1677ff' }}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* 风险趋势 */}
      <Card title="风险趋势" className="mt-4">
        <div style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="high" stroke="#cf1322" name="高风险" />
              <Line type="monotone" dataKey="medium" stroke="#faad14" name="中风险" />
              <Line type="monotone" dataKey="low" stroke="#52c41a" name="低风险" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 风险预警 */}
      <Card 
        title="风险预警" 
        className="mt-4"
        extra={
          <Space>
            <span>自动预警：</span>
            <Switch 
              checked={autoAlert} 
              onChange={setAutoAlert}
              loading={loading}
            />
          </Space>
        }
      >
        <Alert
          message="系统运行正常"
          description="风险监控系统正在运行中，未发现系统异常。"
          type="success"
          showIcon
          className="mb-4"
        />
        <Table
          columns={alertColumns}
          dataSource={mockAlerts}
          rowKey="id"
          pagination={{
            total: mockAlerts.length,
            pageSize: 10,
            showQuickJumper: true,
          }}
        />
      </Card>
    </AppLayout>
  );
} 