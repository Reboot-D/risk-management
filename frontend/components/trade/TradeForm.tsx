'use client';

import { Form, Input, Select, DatePicker, InputNumber, Button, Space, Card, Row, Col } from 'antd';
import { SaveOutlined, RedoOutlined } from '@ant-design/icons';
import type { TradeInfo } from '@/types/trade';
import { RiskLevel, TradeChannelType, TradeControlMethod } from '@/types/trade';

const { Option } = Select;

interface TradeFormProps {
  initialValues?: Partial<TradeInfo>;
  onSubmit: (values: TradeInfo) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export default function TradeForm({ initialValues, onSubmit, onCancel, loading }: TradeFormProps) {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      await form.validateFields();
      onSubmit(values as TradeInfo);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues}
      className="fade-in"
    >
      {/* 基本交易信息 */}
      <Card title="基本交易信息" className="mb-6">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="商户IP地址"
              name="mc_create_trade_ip"
              rules={[
                { required: true, message: '请输入商户IP地址' },
                { pattern: /^(\d{1,3}\.){3}\d{1,3}$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/, message: '请输入有效的IPv4或IPv6地址' }
              ]}
            >
              <Input placeholder="请输入商户IP地址" />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              label="交易创建时间"
              name="mcCreateTradeTime"
              rules={[{ required: true, message: '请选择交易创建时间' }]}
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              label="商品分类"
              name="mcCreateTradeChannelType"
              rules={[{ required: true, message: '请选择商品分类' }]}
            >
              <Select placeholder="请选择商品分类">
                <Option value={TradeChannelType.PHYSICAL}>实物商品</Option>
                <Option value={TradeChannelType.VIRTUAL}>虚拟商品</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="交易渠道"
              name="mcCreateTradeChannel"
              rules={[{ required: true, message: '请输入交易渠道' }]}
            >
              <Input placeholder="如：账户充值、虚拟币购买等" />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              label="渠道风险等级"
              name="tradeChannelRiskLevel"
              rules={[{ required: true, message: '请选择渠道风险等级' }]}
            >
              <Select placeholder="请选择风险等级">
                <Option value={RiskLevel.HIGH}>高风险</Option>
                <Option value={RiskLevel.MID}>中风险</Option>
                <Option value={RiskLevel.LOW}>低风险</Option>
                <Option value={RiskLevel.REL}>相关风险</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              label="是否资金保证金业务"
              name="isFundFreezeBiz"
              rules={[{ required: true, message: '请选择是否为资金保证金业务' }]}
            >
              <Select placeholder="请选择">
                <Option value="Y">是</Option>
                <Option value="N">否</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* 外部账户信息 */}
      <Card title="外部账户信息" className="mb-6">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="账户注册时间"
              name="extraAccountRegTime"
              rules={[{ required: true, message: '请选择账户注册时间' }]}
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              label="账户姓名"
              name="extraAccountName"
              rules={[{ required: true, message: '请输入账户姓名' }]}
            >
              <Input placeholder="请输入账户姓名（部分脱敏）" />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              label="证件号后6位"
              name="extraAccountCertnoLastSix"
              rules={[
                { required: true, message: '请输入证件号后6位' },
                { pattern: /^\d{6}$/, message: '请输入6位数字' }
              ]}
            >
              <Input placeholder="请输入证件号后6位" maxLength={6} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="手机号后4位"
              name="extraAccountPhoneLastFour"
              rules={[
                { required: true, message: '请输入手机号后4位' },
                { pattern: /^\d{4}$/, message: '请输入4位数字' }
              ]}
            >
              <Input placeholder="请输入手机号后4位" maxLength={4} />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              label="手机绑定时间"
              name="extraAccountPhoneRegTime"
              rules={[{ required: true, message: '请选择手机绑定时间' }]}
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              label="近30天登录设备数"
              name="loginDeviceQuantity"
              rules={[{ required: true, message: '请输入登录设备数' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="支付宝买家ID"
              name="alipayUserCustomerId"
            >
              <Input placeholder="请输入支付宝买家ID（选填）" />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              label="账户ID"
              name="desensitizedUid"
              rules={[{ required: true, message: '请输入账户ID' }]}
            >
              <Input placeholder="请输入账户ID" />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              label="账户风险等级"
              name="extraAccountRiskLevel"
              rules={[{ required: true, message: '请选择账户风险等级' }]}
            >
              <Select placeholder="请选择风险等级">
                <Option value={RiskLevel.HIGH}>高风险</Option>
                <Option value={RiskLevel.MID}>中风险</Option>
                <Option value={RiskLevel.LOW}>低风险</Option>
                <Option value={RiskLevel.REL}>相关风险</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="业务等级"
              name="extraAccountBusinessLevel"
              rules={[{ required: true, message: '请输入业务等级' }]}
            >
              <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              label="业务等级判定原因"
              name="extraAccountBusinessLevelReason"
            >
              <Input.TextArea placeholder="请输入业务等级判定原因（选填）" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* 被充值账号信息 */}
      <Card title="被充值账号信息" className="mb-6">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="被充值账号ID"
              name="chargedCardNumber"
              rules={[{ required: true, message: '请输入被充值账号ID' }]}
            >
              <Input placeholder="请输入被充值账号ID" />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              label="账号风险等级"
              name="chargedCardNumberRiskLevel"
              rules={[{ required: true, message: '请选择账号风险等级' }]}
            >
              <Select placeholder="请选择风险等级">
                <Option value={RiskLevel.HIGH}>高风险</Option>
                <Option value={RiskLevel.MID}>中风险</Option>
                <Option value={RiskLevel.LOW}>低风险</Option>
                <Option value={RiskLevel.REL}>相关风险</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* 二级商户信息 */}
      <Card title="二级商户信息" className="mb-6">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="商户ID"
              name="extraMerchantId"
              rules={[{ required: true, message: '请输入商户ID' }]}
            >
              <Input placeholder="请输入商户ID" />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              label="商户风险等级"
              name="extraMerchantRiskLevel"
              rules={[{ required: true, message: '请选择商户风险等级' }]}
            >
              <Select placeholder="请选择风险等级">
                <Option value={RiskLevel.HIGH}>高风险</Option>
                <Option value={RiskLevel.MID}>中风险</Option>
                <Option value={RiskLevel.LOW}>低风险</Option>
                <Option value={RiskLevel.REL}>相关风险</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* 其他信息 */}
      <Card title="其他信息" className="mb-6">
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="交易风险等级"
              name="extraCreateTradeRiskLevel"
              rules={[{ required: true, message: '请选择交易风险等级' }]}
            >
              <Select placeholder="请选择风险等级">
                <Option value={RiskLevel.HIGH}>高风险</Option>
                <Option value={RiskLevel.MID}>中风险</Option>
                <Option value={RiskLevel.LOW}>低风险</Option>
                <Option value={RiskLevel.REL}>相关风险</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              label="管控建议"
              name="extraCreateTradeControlMethod"
              rules={[{ required: true, message: '请选择管控建议' }]}
            >
              <Select placeholder="请选择管控建议">
                <Option value={TradeControlMethod.BLOCK}>交易拦截</Option>
                <Option value={TradeControlMethod.VERIFY}>交易校验</Option>
                <Option value={TradeControlMethod.PASS}>交易放行</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              label="借款类型"
              name="loanType"
            >
              <Select placeholder="请选择借款类型">
                <Option value="consumer">消费贷</Option>
                <Option value="cash">现金贷</Option>
                <Option value="business">企业贷款</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="分期数"
              name="instalments"
            >
              <Select placeholder="请选择分期数">
                {[1, 3, 6, 9, 12].map(num => (
                  <Option key={num} value={num}>{num}期</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              label="已还期数"
              name="repaymentTimes"
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* 表单操作 */}
      <div className="flex justify-end">
        <Space>
          <Button onClick={onCancel}>
            取消
          </Button>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
            提交
          </Button>
          <Button icon={<RedoOutlined />} onClick={() => form.resetFields()}>
            重置
          </Button>
        </Space>
      </div>
    </Form>
  );
} 