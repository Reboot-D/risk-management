'use client';

import { useState } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import AppLayout from '@/components/layout/AppLayout';

export default function Home() {
  // 示例数据
  const riskStats = {
    totalTransactions: 12543,
    riskRate: 2.5,
    blockedTransactions: 314,
    pendingReview: 86
  };

  const riskTrends = [
    { date: '2024-01', rate: 2.8 },
    { date: '2024-02', rate: 2.5 },
    { date: '2024-03', rate: 2.3 }
  ];

  const recentAlerts = [
    {
      id: 1,
      time: '2024-03-15 14:30:25',
      type: 'high',
      description: '检测到异常IP登录',
      status: 'pending'
    },
    {
      id: 2,
      time: '2024-03-15 14:28:15',
      type: 'medium',
      description: '交易金额超出阈值',
      status: 'resolved'
    },
    {
      id: 3,
      time: '2024-03-15 14:25:00',
      type: 'low',
      description: '用户设备变更',
      status: 'pending'
    }
  ];

  const alertColumns = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '风险等级',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colors = {
          high: 'red',
          medium: 'orange',
          low: 'green'
        };
        return (
          <Tag color={colors[type as keyof typeof colors]}>
            {type.toUpperCase()}
          </Tag>
        );
      }
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
      render: (status: string) => (
        <Tag color={status === 'pending' ? 'processing' : 'success'}>
          {status === 'pending' ? '待处理' : '已解决'}
        </Tag>
      )
    }
  ];

  return (
    <AppLayout>
      <div className="fade-in">
        <h2 className="mb-6">数据概览</h2>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false}>
              <Statistic
                title="总交易量"
                value={riskStats.totalTransactions}
                precision={0}
                valueStyle={{ color: '#1677ff' }}
              />
              <div className="mt-4">
                <Progress
                  percent={100}
                  showInfo={false}
                  strokeColor="#1677ff"
                  size="small"
                />
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false}>
              <Statistic
                title="风险率"
                value={riskStats.riskRate}
                precision={2}
                valueStyle={{ color: riskStats.riskRate > 3 ? '#cf1322' : '#3f8600' }}
                suffix="%"
                prefix={riskStats.riskRate > 3 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              />
              <div className="mt-4">
                <Progress
                  percent={riskStats.riskRate * 10}
                  showInfo={false}
                  strokeColor={riskStats.riskRate > 3 ? '#cf1322' : '#3f8600'}
                  size="small"
                />
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false}>
              <Statistic
                title="拦截交易"
                value={riskStats.blockedTransactions}
                valueStyle={{ color: '#cf1322' }}
              />
              <div className="mt-4">
                <Progress
                  percent={(riskStats.blockedTransactions / riskStats.totalTransactions) * 100}
                  showInfo={false}
                  strokeColor="#cf1322"
                  size="small"
                />
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false}>
              <Statistic
                title="待审核"
                value={riskStats.pendingReview}
                valueStyle={{ color: '#faad14' }}
              />
              <div className="mt-4">
                <Progress
                  percent={(riskStats.pendingReview / riskStats.totalTransactions) * 100}
                  showInfo={false}
                  strokeColor="#faad14"
                  size="small"
                />
              </div>
            </Card>
          </Col>
        </Row>

        <div className="mt-8">
          <Card
            title="最近风险预警"
            bordered={false}
          >
            <Table
              columns={alertColumns}
              dataSource={recentAlerts}
              pagination={false}
              rowKey="id"
            />
          </Card>
        </div>
      </div>
    </AppLayout>
  );
} 