import { PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormDigit,
  ProFormSelect,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm, Tag } from 'antd';
import React, { useRef, useState } from 'react';

type QRCodeBatchItem = {
  id: string;
  batchNumber: string;
  quantity: number;
  generateTime: string;
  generateUser: string;
  status: 'generated' | 'exported' | 'used';
  accessUrl: string;
};

const QRCodeManagement: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<QRCodeBatchItem | undefined>();
  const actionRef = useRef<ActionType>();

  // 模拟设备数据
  const deviceOptions = [
    { label: '成型机A', value: 'device_1' },
    { label: '检测设备B', value: 'device_2' },
    { label: '运输带C', value: 'device_3' },
    { label: '包装机D', value: 'device_4' },
    { label: '焊接机E', value: 'device_5' },
  ];

  const statusMap = {
    generated: { text: '已生成', color: 'blue' },
    exported: { text: '已导出', color: 'green' },
    used: { text: '已使用', color: 'orange' },
  };

  const handleCreate = async (values: any) => {
    try {
      const batchNumber = `QR${Date.now()}`;
      console.log('创建二维码批次:', {
        ...values,
        batchNumber,
        generateTime: new Date().toLocaleString(),
        generateUser: '当前用户', // 实际项目中从用户信息获取
        status: 'generated',
      });
      message.success(`成功生成 ${values.quantity} 个二维码，批次号：${batchNumber}`);
      handleModalOpen(false);
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error('生成失败，请重试');
      return false;
    }
  };

  const handleExport = async (values: any) => {
    try {
      console.log('导出二维码:', {
        batchId: currentRecord?.id,
        exportPath: values.exportPath,
        targetDevice: values.targetDevice,
      });
      message.success(`二维码已导出到：${values.exportPath}`);
      setExportModalOpen(false);
      setCurrentRecord(undefined);
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error('导出失败，请重试');
      return false;
    }
  };

  const handleDelete = async (record: QRCodeBatchItem) => {
    try {
      console.log('删除二维码批次:', record.id);
      message.success('删除成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('删除失败，请重试');
    }
  };

  const columns: ProColumns<QRCodeBatchItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 60,
      search: false,
    },
    {
      title: '二维码批次号',
      dataIndex: 'batchNumber',
      copyable: true,
      ellipsis: true,
      width: 150,
    },
    {
      title: '二维码数量',
      dataIndex: 'quantity',
      width: 120,
      search: false,
      render: (text) => (
        <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
          {text}
        </span>
      ),
    },
    {
      title: '生成时间',
      dataIndex: 'generateTime',
      valueType: 'dateTime',
      width: 160,
      search: false,
    },
    {
      title: '生成人员',
      dataIndex: 'generateUser',
      width: 120,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (_, record) => (
        <Tag color={statusMap[record.status].color}>
          {statusMap[record.status].text}
        </Tag>
      ),
      valueEnum: {
        generated: { text: '已生成', status: 'processing' },
        exported: { text: '已导出', status: 'success' },
        used: { text: '已使用', status: 'warning' },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 120,
      render: (_, record) => [
        <a
          key="export"
          onClick={() => {
            setCurrentRecord(record);
            setExportModalOpen(true);
          }}
        >
          <DownloadOutlined /> 导出
        </a>,
        <Popconfirm
          key="delete"
          title="确认删除"
          description="确定要删除这个二维码批次吗？删除后无法恢复。"
          onConfirm={() => handleDelete(record)}
          okText="确认"
          cancelText="取消"
        >
          <a style={{ color: '#ff4d4f' }}>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<QRCodeBatchItem>
        headerTitle="二维码管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 新增二维码
          </Button>,
        ]}
        request={async () => {
          // 模拟数据
          const mockData: QRCodeBatchItem[] = [
            {
              id: '1',
              batchNumber: 'QR202401001',
              quantity: 1000,
              generateTime: '2024-01-01 10:00:00',
              generateUser: '张三',
              status: 'exported',
              accessUrl: 'https://example.com/qr/batch1',
            },
            {
              id: '2',
              batchNumber: 'QR202401002',
              quantity: 500,
              generateTime: '2024-01-02 14:30:00',
              generateUser: '李四',
              status: 'generated',
              accessUrl: 'https://example.com/qr/batch2',
            },
            {
              id: '3',
              batchNumber: 'QR202401003',
              quantity: 2000,
              generateTime: '2024-01-03 09:15:00',
              generateUser: '王五',
              status: 'used',
              accessUrl: 'https://example.com/qr/batch3',
            },
            {
              id: '4',
              batchNumber: 'QR202401004',
              quantity: 800,
              generateTime: '2024-01-04 16:45:00',
              generateUser: '赵六',
              status: 'generated',
              accessUrl: 'https://example.com/qr/batch4',
            },
          ];
          return {
            data: mockData,
            success: true,
            total: mockData.length,
          };
        }}
        columns={columns}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
      />
      
      {/* 新增二维码表单 */}
      <ModalForm
        title="新增二维码"
        width="500px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={handleCreate}
      >
        <ProFormDigit
          rules={[
            { required: true, message: '生成数量为必填项' },
            { min: 1, message: '生成数量必须大于0' },
            { max: 10000, message: '单次生成数量不能超过10000' },
          ]}
          width="md"
          name="quantity"
          label="生成数量"
          placeholder="请输入要生成的二维码数量"
          min={1}
          max={10000}
          fieldProps={{
            precision: 0,
          }}
        />
        <ProFormText
          rules={[
            { required: true, message: '访问URL为必填项' },
            { type: 'url', message: '请输入有效的URL地址' },
          ]}
          width="md"
          name="accessUrl"
          label="访问URL"
          placeholder="请输入二维码访问地址，如：https://example.com/product/"
          extra="二维码扫描后跳转的基础URL地址"
        />
      </ModalForm>

      {/* 导出二维码表单 */}
      <ModalForm
        title="导出二维码"
        width="500px"
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        onFinish={handleExport}
      >
        <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f6f6f6', borderRadius: 4 }}>
          <p style={{ margin: 0, color: '#666' }}>
            批次号：{currentRecord?.batchNumber}<br/>
            数量：{currentRecord?.quantity} 个
          </p>
        </div>
        <ProFormText
          rules={[
            { required: true, message: '导出地址为必填项' },
          ]}
          width="md"
          name="exportPath"
          label="导出地址"
          placeholder="请输入导出文件保存路径，如：D:\\QRCodes\\"
          extra="二维码文件将保存到指定目录"
        />
        <ProFormSelect
          name="targetDevice"
          label="选择导入设备"
          width="md"
          options={deviceOptions}
          rules={[{ required: true, message: '请选择导入设备' }]}
          placeholder="请选择要导入二维码的设备"
          extra="选择将二维码数据导入到哪个设备"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default QRCodeManagement;