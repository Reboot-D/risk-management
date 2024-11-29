'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <ConfigProvider
          locale={zhCN}
          theme={{
            token: {
              colorPrimary: '#1677ff',
            },
          }}
        >
          <AntdApp>
            {children}
          </AntdApp>
        </ConfigProvider>
      </body>
    </html>
  );
} 