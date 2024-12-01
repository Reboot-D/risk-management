'use client';

import { useState } from 'react';
import { Modal, Upload, Button, Steps, Alert, Progress, Typography } from 'antd';
import { UploadOutlined, FileExcelOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { tradesApi } from '@/services/api';

const { Text, Link } = Typography;
const { Step } = Steps;

interface ImportModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function ImportModal({ open, onCancel, onSuccess }: ImportModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{
    total: number;
    success: number;
    failed: number;
  } | null>(null);

  // 下载模板
  const handleDownloadTemplate = () => {
    const headers = [
      'mc_create_trade_ip',
      'mcCreateTradeTime',
      'mcCreateTradeChannelType',
      'mcCreateTradeChannel',
      'tradeChannelRiskLevel',
      'isFundFreezeBiz',
      'extraAccountRegTime',
      'extraAccountName',
      'extraAccountCertno',
      'extraAccountCertnoLastSix',
      'extraAccountPhone',
      'extraAccountPhoneLastFour',
      'extraAccountPhoneRegTime',
      'loginDeviceQuantity',
      'alipayUserCustomerId',
      'desensitizedUid',
      'extraAccountRiskLevel',
      'extraAccountBusinessLevel',
      'extraAccountBusinessLevelReason',
      'chargedCardNumber',
      'chargedCardNumberRiskLevel',
      'extraMerchantId',
      'extraMerchantRiskLevel',
      'extraCreateTradeRiskLevel',
      'extraCreateTradeControlMethod',
      'loanType',
      'instalments',
      'repaymentTimes'
    ].join(',');

    const blob = new Blob([headers + '\n'], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '交易数据导入模板.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 文件上传配置
  const uploadProps: UploadProps = {
    accept: '.csv',
    maxCount: 1,
    fileList,
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  // 开始导入
  const handleImport = async () => {
    if (fileList.length === 0) {
      setError('请先选择要导入的文件');
      return;
    }

    setImporting(true);
    setError(null);
    setProgress(0);

    try {
      const result = await tradesApi.importTrades(fileList[0] as any);
      setImportResult({
        total: result.total,
        success: result.success,
        failed: result.failed,
      });
      setCurrentStep(2);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : '导入失败');
      console.error('Import error:', err);
    } finally {
      setImporting(false);
    }
  };

  // 重置状态
  const handleClose = () => {
    setCurrentStep(0);
    setFileList([]);
    setError(null);
    setImportResult(null);
    setProgress(0);
    onCancel();
  };

  const steps = [
    {
      title: '下载模板',
      content: (
        <div className="py-4">
          <Alert
            message="请先下载导入模板，按照模板格式填写数据"
            type="info"
            showIcon
            className="mb-4"
          />
          <Button 
            icon={<FileExcelOutlined />} 
            onClick={handleDownloadTemplate}
          >
            下载模板
          </Button>
        </div>
      ),
    },
    {
      title: '上传文件',
      content: (
        <div className="py-4">
          <Alert
            message="请选择填写好的CSV文件进行上传"
            type="info"
            showIcon
            className="mb-4"
          />
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>选择文件</Button>
          </Upload>
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="mt-4"
            />
          )}
        </div>
      ),
    },
    {
      title: '导入完成',
      content: (
        <div className="py-4">
          {importResult && (
            <>
              <Alert
                message="数据导入完成"
                type="success"
                showIcon
                className="mb-4"
              />
              <div className="text-center">
                <CheckCircleOutlined className="text-success text-4xl mb-4" />
                <div className="mb-2">
                  <Text>总数据量：{importResult.total}</Text>
                </div>
                <div className="mb-2">
                  <Text type="success">成功导入：{importResult.success}</Text>
                </div>
                <div className="mb-4">
                  <Text type="danger">导入失败：{importResult.failed}</Text>
                </div>
                {importResult.failed > 0 && (
                  <Link href="/import-errors.csv" target="_blank">
                    下载错误记录
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <Modal
      title="导入交易数据"
      open={open}
      onCancel={handleClose}
      width={600}
      footer={
        currentStep === steps.length - 1 ? (
          <Button type="primary" onClick={handleClose}>
            完成
          </Button>
        ) : (
          <>
            <Button onClick={handleClose}>取消</Button>
            <Button
              type="primary"
              onClick={() => {
                if (currentStep === 1) {
                  handleImport();
                } else {
                  setCurrentStep(currentStep + 1);
                }
              }}
              loading={importing}
              disabled={currentStep === 1 && fileList.length === 0}
            >
              {currentStep === 1 ? '开始导入' : '下一步'}
            </Button>
          </>
        )
      }
    >
      <Steps current={currentStep} items={steps} className="mb-4" />
      {steps[currentStep].content}
      {importing && (
        <Progress percent={progress} status="active" className="mt-4" />
      )}
    </Modal>
  );
} 