'use client';

import { ReactNode, useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link href="/">数据概览</Link>,
    },
    {
      key: '/trades',
      icon: <DatabaseOutlined />,
      label: <Link href="/trades">交易管理</Link>,
    },
    {
      key: '/risk',
      icon: <SafetyCertificateOutlined />,
      label: <Link href="/risk">风险控制</Link>,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link href="/settings">系统设置</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/']}
          selectedKeys={[pathname]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
} 