'use client';

import { useState } from 'react';
import { Card, Table, Tag, Button, Space, message, Modal } from 'antd';
import { PlusOutlined, SearchOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import AppLayout from '@/components/layout/AppLayout';
import TradeForm from '@/components/trade/TradeForm';
import ImportModal from '@/components/trade/ImportModal';
import type { TradeInfo } from '@/types/trade';
import { RiskLevel } from '@/types/trade';
import { tradesApi } from '@/services/api';

const getRiskLevelColor = (level: RiskLevel) => {
  const colors: Record<RiskLevel, string> = {
    [RiskLevel.HIGH]: 'red',
    [RiskLevel.MID]: 'orange',
    [RiskLevel.LOW]: 'green',
    [RiskLevel.REL]: 'blue'
  };
  return colors[level];
};

const getRiskLevelText = (level: RiskLevel) => {
  const texts: Record<RiskLevel, string> = {
    [RiskLevel.HIGH]: '高风险',
    [RiskLevel.MID]: '中风险',
    [RiskLevel.LOW]: '低风险',
    [RiskLevel.REL]: '相关风险'
  };
  return texts[level];
};

export default function TradesPage() {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<TradeInfo | null>(null);
  const [trades, setTrades] = useState<TradeInfo[]>([]);

  const columns = [
    {
      title: '交易创建时间',
      dataIndex: 'mcCreateTradeTime',
      key: 'mcCreateTradeTime',
      sorter: true,
      width: 180,
    },
    {
      title: '商户IP',
      dataIndex: 'mc_create_trade_ip',
      key: 'mc_create_trade_ip',
      width: 140,
    },
    {
      title: '账户姓名',
      dataIndex: 'extraAccountName',
      key: 'extraAccountName',
      width: 120,
    },
    {
      title: '交易渠道',
      dataIndex: 'mcCreateTradeChannel',
      key: 'mcCreateTradeChannel',
      width: 140,
    },
    {
      title: '渠道风险等级',
      dataIndex: 'tradeChannelRiskLevel',
      key: 'tradeChannelRiskLevel',
      width: 120,
      render: (level: RiskLevel) => (
        <Tag color={getRiskLevelColor(level)}>
          {getRiskLevelText(level)}
        </Tag>
      ),
    },
    {
      title: '账户风险等级',
      dataIndex: 'extraAccountRiskLevel',
      key: 'extraAccountRiskLevel',
      width: 120,
      render: (level: RiskLevel) => (
        <Tag color={getRiskLevelColor(level)}>
          {getRiskLevelText(level)}
        </Tag>
      ),
    },
    {
      title: '交易风险等级',
      dataIndex: 'extraCreateTradeRiskLevel',
      key: 'extraCreateTradeRiskLevel',
      width: 120,
      render: (level: RiskLevel) => (
        <Tag color={getRiskLevelColor(level)}>
          {getRiskLevelText(level)}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: TradeInfo) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleView(record)}>
            查看
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setSelectedTrade(null);
    setModalVisible(true);
  };

  const handleView = (trade: TradeInfo) => {
    setSelectedTrade(trade);
    setModalVisible(true);
  };

  const handleDelete = async (trade: TradeInfo) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条交易记录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          // TODO: 调用删除API
          message.success('删除成功');
          // 重新加载数据
        } catch (error) {
          message.error('删除失败');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleSubmit = async (values: TradeInfo) => {
    try {
      setLoading(true);
      // TODO: 调用创建/更新API
      message.success(selectedTrade ? '更新成功' : '创建成功');
      setModalVisible(false);
      // 重新加载数据
    } catch (error) {
      message.error(selectedTrade ? '更新失败' : '创建失败');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const response = await tradesApi.exportTrades();
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `交易数据_${new Date().toISOString()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      message.error('导出失败');
    } finally {
      setLoading(false);
    }
  };

  const handleImportSuccess = () => {
    message.success('导入成功');
    loadTrades();
    setImportModalVisible(false);
  };

  const loadTrades = async () => {
    try {
      setLoading(true);
      const response = await tradesApi.getTrades();
      if (response.status === 'success' && response.data) {
        setTrades(response.data);
      }
    } catch (error) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <Card
        title="交易管理"
        extra={
          <Space>
            <Button icon={<SearchOutlined />}>搜索</Button>
            <Button 
              icon={<DownloadOutlined />} 
              onClick={handleExport}
              loading={loading}
            >
              导出
            </Button>
            <Button 
              icon={<UploadOutlined />} 
              onClick={() => setImportModalVisible(true)}
            >
              导入
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => {
                setSelectedTrade(null);
                setModalVisible(true);
              }}
            >
              新增
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={trades}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            total: trades.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      <Modal
        title={selectedTrade ? '查看交易' : '新增交易'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={1200}
      >
        <TradeForm
          initialValues={selectedTrade || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setModalVisible(false)}
          loading={loading}
        />
      </Modal>

      <ImportModal
        open={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        onSuccess={handleImportSuccess}
      />
    </AppLayout>
  );
} 