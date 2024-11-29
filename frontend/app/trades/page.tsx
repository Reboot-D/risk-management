'use client';

import { useState, useEffect } from 'react';
import { Card, Tabs, Table, Button, Space, message } from 'antd';
import MainLayout from '@/components/layout/MainLayout';
import { tradesApi } from '@/services/api';
import type { TradeInfo } from '@/types/trade';

export default function TradesPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [loading, setLoading] = useState(false);
  const [trades, setTrades] = useState<TradeInfo[]>([]);

  // 加载交易数据
  const loadTrades = async () => {
    try {
      setLoading(true);
      const response = await tradesApi.getTrades();
      if (response.status === 'success' && response.data) {
        setTrades(response.data);
      } else {
        message.error('加载数据失败');
      }
    } catch (error) {
      console.error('Failed to load trades:', error);
      message.error('加载数据失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    loadTrades();
  }, []);

  // Tab items 配置
  const items = [
    {
      key: 'list',
      label: '交易列表',
      children: (
        <div>
          <div className="mb-4 flex justify-end">
            <Button type="primary" onClick={loadTrades}>
              刷新数据
            </Button>
          </div>
          <Table
            loading={loading}
            columns={[
              {
                title: '交易时间',
                dataIndex: 'mcCreateTradeTime',
                key: 'mcCreateTradeTime',
              },
              {
                title: '交易渠道',
                dataIndex: 'mcCreateTradeChannel',
                key: 'mcCreateTradeChannel',
              },
              {
                title: '风险等级',
                dataIndex: 'extraCreateTradeRiskLevel',
                key: 'extraCreateTradeRiskLevel',
              },
            ]}
            dataSource={trades}
            rowKey="id"
          />
        </div>
      ),
    },
    {
      key: 'create',
      label: '新建交易',
      children: <div>新建交易表单</div>,
    },
  ];

  return (
    <MainLayout>
      <Card title="交易管理">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
        />
      </Card>
    </MainLayout>
  );
} 