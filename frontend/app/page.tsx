'use client';

import { useState, useEffect } from 'react';
import {
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  Button,
  Table,
  Card,
  message,
  Tabs,
  Space,
  Row,
  Col,
} from 'antd';
import type { TradeInfo } from '@/types/trade';
import { tradesApi } from '@/services/api';
import dayjs from 'dayjs';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

export default function Home() {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TradeInfo[]>([]);
  const [searchParams, setSearchParams] = useState<any>({});

  // 加载数据
  const loadData = async (params = {}) => {
    try {
      setLoading(true);
      const response = await tradesApi.getTrades(params);
      if (response.status === 'success' && response.data) {
        setData(response.data);
      }
    } catch (error) {
      message.error('加载数据失败');
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 首次加载
  useEffect(() => {
    loadData(searchParams);
  }, [searchParams]);

  // 搜索
  const handleSearch = async (values: any) => {
    const params = {
      ...values,
      dateRange: values.dateRange ? {
        start: values.dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
        end: values.dateRange[1].format('YYYY-MM-DD HH:mm:ss'),
      } : undefined,
    };
    setSearchParams(params);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setSearchParams({});
  };

  // 导出数据
  const handleExport = async () => {
    try {
      setLoading(true);
      const response = await tradesApi.exportTrades(searchParams);
      
      // 创建下载链接
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `交易数据_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success('导出成功');
    } catch (error) {
      message.error('导出失败');
      console.error('Export error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 提交表单
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      // 处理日期字段
      const formattedValues = {
        ...values,
        mcCreateTradeTime: values.mcCreateTradeTime?.toDate(),
        extraAccountRegTime: values.extraAccountRegTime?.toDate(),
        extraAccountPhoneRegTime: values.extraAccountPhoneRegTime?.toDate(),
      };

      const response = await tradesApi.createTrade(formattedValues);
      if (response.status === 'success') {
        message.success('数据保存成功');
        form.resetFields();
        loadData();
      } else {
        message.error(response.message || '保存失败');
      }
    } catch (error) {
      message.error('保存失败');
      console.error('Submit form error:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '交易时间',
      dataIndex: 'mcCreateTradeTime',
      key: 'mcCreateTradeTime',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '交易渠道',
      dataIndex: 'mcCreateTradeChannel',
      key: 'mcCreateTradeChannel',
    },
    {
      title: '账户名称',
      dataIndex: 'extraAccountName',
      key: 'extraAccountName',
    },
    {
      title: '风险等级',
      dataIndex: 'extraCreateTradeRiskLevel',
      key: 'extraCreateTradeRiskLevel',
      render: (level: string) => {
        const colors = {
          high: 'red',
          mid: 'orange',
          low: 'green',
          rel: 'blue',
        };
        return <span style={{ color: colors[level as keyof typeof colors] }}>{level.toUpperCase()}</span>;
      },
    },
  ];

  return (
    <div className="p-6">
      {/* 搜索表单 */}
      <Card className="mb-6">
        <Form
          form={searchForm}
          layout="horizontal"
          onFinish={handleSearch}
          className="mb-4"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="dateRange" label="交易时间">
                <RangePicker
                  showTime
                  style={{ width: '100%' }}
                  placeholder={['开始时间', '结束时间']}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="mcCreateTradeChannel" label="交易渠道">
                <Input placeholder="请输入交易渠道" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="extraCreateTradeRiskLevel" label="风险等级">
                <Select placeholder="请选择风险等级">
                  <Option value="high">高风险</Option>
                  <Option value="mid">中风险</Option>
                  <Option value="low">低风险</Option>
                  <Option value="rel">相关风险</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="extraAccountName" label="账户名称">
                <Input placeholder="请输入账户名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="chargedCardNumber" label="被充值账号">
                <Input placeholder="请输入被充值账号" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item className="flex justify-end">
                <Space>
                  <Button onClick={handleReset}>重置</Button>
                  <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
                    搜索
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<DownloadOutlined />} 
                    onClick={handleExport}
                    loading={loading}
                  >
                    导出数据
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card title="数据录入" className="mb-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="基本交易信息" key="1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Form.Item
                  label="IP地址"
                  name="mc_create_trade_ip"
                  rules={[{ required: true, message: '请输入IP地址' }]}
                >
                  <Input placeholder="请输入IP地址" />
                </Form.Item>

                <Form.Item
                  label="交易时间"
                  name="mcCreateTradeTime"
                  rules={[{ required: true, message: '请选择交易时间' }]}
                >
                  <DatePicker showTime style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  label="商品分类"
                  name="mcCreateTradeChannelType"
                  rules={[{ required: true, message: '请选择商品分类' }]}
                >
                  <Select>
                    <Option value="physical">实物</Option>
                    <Option value="virtual">虚拟</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="交易渠道"
                  name="mcCreateTradeChannel"
                  rules={[{ required: true, message: '请输入交易渠道' }]}
                >
                  <Input placeholder="如：账户充值、虚拟币购买等" />
                </Form.Item>

                <Form.Item
                  label="风险等级"
                  name="tradeChannelRiskLevel"
                  rules={[{ required: true, message: '请选择风险等级' }]}
                >
                  <Select>
                    <Option value="high">高风险</Option>
                    <Option value="mid">中风险</Option>
                    <Option value="low">低风险</Option>
                    <Option value="rel">相关风险</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="是否资金保证金业务"
                  name="isFundFreezeBiz"
                  rules={[{ required: true, message: '请选择是否资金保证金业务' }]}
                >
                  <Select>
                    <Option value="Y">是</Option>
                    <Option value="N">否</Option>
                  </Select>
                </Form.Item>
              </div>
            </TabPane>

            <TabPane tab="外部账户信息" key="2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Form.Item
                  label="账户注册时间"
                  name="extraAccountRegTime"
                  rules={[{ required: true, message: '请选择账户注册时间' }]}
                >
                  <DatePicker showTime style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  label="账户姓名"
                  name="extraAccountName"
                  rules={[{ required: true, message: '请输入账户姓名' }]}
                >
                  <Input placeholder="请输入账户姓名" />
                </Form.Item>

                <Form.Item
                  label="证件号"
                  name="extraAccountCertno"
                  rules={[{ required: true, message: '请输入证件号' }]}
                >
                  <Input placeholder="请输入证件号" />
                </Form.Item>

                <Form.Item
                  label="证件号后6位"
                  name="extraAccountCertnoLastSix"
                  rules={[
                    { required: true, message: '请输入证件号后6位' },
                    { len: 6, message: '必须是6位' },
                  ]}
                >
                  <Input placeholder="请输入证件号后6位" maxLength={6} />
                </Form.Item>

                <Form.Item
                  label="手机号"
                  name="extraAccountPhone"
                  rules={[{ required: true, message: '请输入手机号' }]}
                >
                  <Input placeholder="请输入手机号" />
                </Form.Item>

                <Form.Item
                  label="手机号后4位"
                  name="extraAccountPhoneLastFour"
                  rules={[
                    { required: true, message: '请输入手机号后4位' },
                    { len: 4, message: '必须是4位' },
                  ]}
                >
                  <Input placeholder="请输入手机号后4位" maxLength={4} />
                </Form.Item>

                <Form.Item
                  label="手机绑定时间"
                  name="extraAccountPhoneRegTime"
                  rules={[{ required: true, message: '请选择手机绑定时间' }]}
                >
                  <DatePicker showTime style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  label="登录设备数量"
                  name="loginDeviceQuantity"
                  rules={[{ required: true, message: '请输入登录设备数量' }]}
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  label="支付宝买家ID"
                  name="alipayUserCustomerId"
                >
                  <Input placeholder="请输入支付宝买家ID" />
                </Form.Item>

                <Form.Item
                  label="账户ID"
                  name="desensitizedUid"
                  rules={[{ required: true, message: '请输入账户ID' }]}
                >
                  <Input placeholder="请输入账户ID" />
                </Form.Item>

                <Form.Item
                  label="账户风险等级"
                  name="extraAccountRiskLevel"
                  rules={[{ required: true, message: '请选择账户风险等级' }]}
                >
                  <Select>
                    <Option value="high">高风险</Option>
                    <Option value="mid">中风险</Option>
                    <Option value="low">低风险</Option>
                    <Option value="rel">相关风险</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="账户业务等级"
                  name="extraAccountBusinessLevel"
                  rules={[{ required: true, message: '请输入账户业务等级' }]}
                >
                  <InputNumber min={1} max={10} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  label="业务等级原因"
                  name="extraAccountBusinessLevelReason"
                >
                  <Input.TextArea placeholder="请输入业务等级判定原因" />
                </Form.Item>
              </div>
            </TabPane>

            <TabPane tab="其他信息" key="3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Form.Item
                  label="被充值账号ID"
                  name="chargedCardNumber"
                  rules={[{ required: true, message: '请输入被充值账号ID' }]}
                >
                  <Input placeholder="请输入被充值账号ID" />
                </Form.Item>

                <Form.Item
                  label="被充值账号风险等级"
                  name="chargedCardNumberRiskLevel"
                  rules={[{ required: true, message: '请选择被充值账号风险等级' }]}
                >
                  <Select>
                    <Option value="high">高风险</Option>
                    <Option value="mid">中风险</Option>
                    <Option value="low">低风险</Option>
                    <Option value="rel">相关风险</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="商户ID"
                  name="extraMerchantId"
                  rules={[{ required: true, message: '请输入商户ID' }]}
                >
                  <Input placeholder="请输入商户ID" />
                </Form.Item>

                <Form.Item
                  label="商户风险等级"
                  name="extraMerchantRiskLevel"
                  rules={[{ required: true, message: '请选择商户风险等级' }]}
                >
                  <Select>
                    <Option value="high">高风险</Option>
                    <Option value="mid">中风险</Option>
                    <Option value="low">低风险</Option>
                    <Option value="rel">相关风险</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="交易风险等级"
                  name="extraCreateTradeRiskLevel"
                  rules={[{ required: true, message: '请选择交易风险等级' }]}
                >
                  <Select>
                    <Option value="high">高风险</Option>
                    <Option value="mid">中风险</Option>
                    <Option value="low">低风险</Option>
                    <Option value="rel">相关风险</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="交易管控方式"
                  name="extraCreateTradeControlMethod"
                  rules={[{ required: true, message: '请选择交易管控方式' }]}
                >
                  <Select>
                    <Option value="block">交易拦截</Option>
                    <Option value="verify">交易校验</Option>
                    <Option value="pass">交易放行</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="借款类型"
                  name="loanType"
                >
                  <Select>
                    <Option value="consumer">消费贷</Option>
                    <Option value="cash">现金贷</Option>
                    <Option value="business">企业贷款</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="分期数"
                  name="instalments"
                >
                  <Select>
                    <Option value={1}>1期</Option>
                    <Option value={3}>3期</Option>
                    <Option value={6}>6期</Option>
                    <Option value={9}>9期</Option>
                    <Option value={12}>12期</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="已还期数"
                  name="repaymentTimes"
                >
                  <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
              </div>
            </TabPane>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button type="primary" htmlType="submit" loading={loading}>
              提交数据
            </Button>
          </div>
        </Form>
      </Card>

      <Card title="数据列表">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            total: data.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>
    </div>
  );
} 