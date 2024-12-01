'use client';

import { useState } from 'react';
import { Card, Form, Input, InputNumber, Select, Switch, Button, Tabs, Space, message } from 'antd';
import { SaveOutlined, RedoOutlined } from '@ant-design/icons';
import AppLayout from '@/components/layout/AppLayout';

const { Option } = Select;

export default function SettingsPage() {
  const [form] = Form.useForm();

  // 基本设置表单提交
  const handleBasicSubmit = async (values: any) => {
    console.log('基本设置:', values);
    message.success('设置已保存');
  };

  // 风险阈值设置表单提交
  const handleRiskSubmit = async (values: any) => {
    console.log('风险阈值设置:', values);
    message.success('设置已保存');
  };

  // 通知设置表单提交
  const handleNotificationSubmit = async (values: any) => {
    console.log('通知设置:', values);
    message.success('设置已保存');
  };

  const items = [
    {
      key: 'basic',
      label: '基本设置',
      children: (
        <Form
          layout="vertical"
          form={form}
          onFinish={handleBasicSubmit}
          initialValues={{
            systemName: '风险数据管理系统',
            language: 'zh_CN',
            timezone: 'Asia/Shanghai',
            enableAudit: true
          }}
        >
          <Form.Item
            label="系统名称"
            name="systemName"
            rules={[{ required: true, message: '请输入系统名称' }]}
          >
            <Input placeholder="请输入系统名称" />
          </Form.Item>

          <Form.Item
            label="系统语言"
            name="language"
            rules={[{ required: true, message: '请选择系统语言' }]}
          >
            <Select placeholder="请选择系统语言">
              <Option value="zh_CN">简体中文</Option>
              <Option value="en_US">English</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="时区设置"
            name="timezone"
            rules={[{ required: true, message: '请选择时区' }]}
          >
            <Select placeholder="请选择时区">
              <Option value="Asia/Shanghai">中国标准时间 (UTC+8)</Option>
              <Option value="America/New_York">美国东部时间 (UTC-5)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="启用审计日志"
            name="enableAudit"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                保存设置
              </Button>
              <Button icon={<RedoOutlined />} onClick={() => form.resetFields()}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'risk',
      label: '风险阈值设置',
      children: (
        <Form
          layout="vertical"
          onFinish={handleRiskSubmit}
          initialValues={{
            highRiskThreshold: 80,
            mediumRiskThreshold: 60,
            maxLoginAttempts: 5,
            sessionTimeout: 30
          }}
        >
          <Form.Item
            label="高风险阈值"
            name="highRiskThreshold"
            rules={[{ required: true, message: '请输入高风险阈值' }]}
          >
            <InputNumber<number>
              min={0}
              max={100}
              formatter={(value) => `${value}%`}
              parser={(value) => {
                const parsed = value ? parseFloat(value.replace('%', '')) : 0;
                return Math.min(100, Math.max(0, parsed));
              }}
              style={{ width: 120 }}
            />
          </Form.Item>

          <Form.Item
            label="中风险阈值"
            name="mediumRiskThreshold"
            rules={[{ required: true, message: '请输入中风险阈值' }]}
          >
            <InputNumber<number>
              min={0}
              max={100}
              formatter={(value) => `${value}%`}
              parser={(value) => {
                const parsed = value ? parseFloat(value.replace('%', '')) : 0;
                return Math.min(100, Math.max(0, parsed));
              }}
              style={{ width: 120 }}
            />
          </Form.Item>

          <Form.Item
            label="最大登录尝试次数"
            name="maxLoginAttempts"
            rules={[{ required: true, message: '请输入最大登录尝试次数' }]}
          >
            <InputNumber min={1} max={10} />
          </Form.Item>

          <Form.Item
            label="会话超时时间（分钟）"
            name="sessionTimeout"
            rules={[{ required: true, message: '请输入会话超时时间' }]}
          >
            <InputNumber min={5} max={120} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                保存设置
              </Button>
              <Button icon={<RedoOutlined />} onClick={() => form.resetFields()}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'notification',
      label: '通知设置',
      children: (
        <Form
          layout="vertical"
          onFinish={handleNotificationSubmit}
          initialValues={{
            enableEmailNotification: true,
            enableSmsNotification: false,
            notifyHighRisk: true,
            notifyMediumRisk: true,
            notifyLowRisk: false
          }}
        >
          <Form.Item
            label="启用邮件通知"
            name="enableEmailNotification"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="启用短信通知"
            name="enableSmsNotification"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="通知接收邮箱"
            name="notificationEmail"
            rules={[
              { type: 'email', message: '请输入有效的邮箱地址' },
              { required: true, message: '请输入通知接收邮箱' }
            ]}
          >
            <Input placeholder="请输入通知接收邮箱" />
          </Form.Item>

          <Form.Item
            label="通知接收手机"
            name="notificationPhone"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' },
              { required: true, message: '请输入通知接收手机' }
            ]}
          >
            <Input placeholder="请输入通知接收手机" />
          </Form.Item>

          <Form.Item
            label="高风险事件通知"
            name="notifyHighRisk"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="中风险事件通知"
            name="notifyMediumRisk"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="低风险事件通知"
            name="notifyLowRisk"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                保存设置
              </Button>
              <Button icon={<RedoOutlined />} onClick={() => form.resetFields()}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <AppLayout>
      <div className="fade-in">
        <h2 className="mb-6">系统设置</h2>
        <Card>
          <Tabs
            defaultActiveKey="basic"
            items={items}
            type="card"
          />
        </Card>
      </div>
    </AppLayout>
  );
} 