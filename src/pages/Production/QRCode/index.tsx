import { DownloadOutlined, PlusOutlined, QrcodeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm, Modal, Space } from 'antd';
import React, { useRef, useState } from 'react';

type QRCodeItem = {
  id: string;
  name: string;
  content: string;
  type: 'product' | 'equipment' | 'process';
  status: 'active' | 'inactive';
  createTime: string;
  updateTime: string;
};

const QRCodeManagement: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<QRCodeItem>();
  const actionRef = useRef<ActionType>();

  // 模拟数据
  const mockData: QRCodeItem[] = [
    {
      id: '1',
      name: '产品A二维码',
      content: 'PRODUCT_A_001',
      type: 'product',
      status: 'active',
      createTime: '2023-12-01 10:00:00',
      updateTime: '2023-12-01 10:00:00',
    },
    {
      id: '2',
      name: '设备B二维码',
      content: 'EQUIPMENT_B_002',
      type: 'equipment',
      status: 'active',
      createTime: '2023-12-01 10:00:00',
      updateTime: '2023-12-01 10:00:00',
    },
  ];

  const handleGenerateQR = (record: QRCodeItem) => {
    setCurrentRow(record);
    setPreviewModalOpen(true);
  };

  const handleExportQR = (record: QRCodeItem) => {
    message.success(`导出二维码: ${record.name}`);
  };

  const columns: ProColumns<QRCodeItem>[] = [
    {
      title: '二维码名称',
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              handleUpdateModalOpen(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '二维码内容',
      dataIndex: 'content',
    },
    {
      title: '类型',
      dataIndex: 'type',
      valueEnum: {
        product: { text: '产品', status: 'Success' },
        equipment: { text: '设备', status: 'Processing' },
        process: { text: '工序', status: 'Warning' },
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        active: { text: '启用', status: 'Success' },
        inactive: { text: '禁用', status: 'Error' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="generate"
          onClick={() => handleGenerateQR(record)}
        >
          <QrcodeOutlined /> 生成
        </a>,
        <a
          key="export"
          onClick={() => handleExportQR(record)}
        >
          <DownloadOutlined /> 导出
        </a>,
        <a
          key="config"
          onClick={() => {
            setCurrentRow(record);
            handleUpdateModalOpen(true);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="确定删除这个二维码吗？"
          onConfirm={() => {
            message.success('删除成功');
            actionRef.current?.reload();
          }}
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<QRCodeItem>
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
          return {
            data: mockData,
            success: true,
            total: mockData.length,
          };
        }}
        columns={columns}
      />
      
      <ModalForm
        title="新增二维码"
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          message.success('提交成功');
          handleModalOpen(false);
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '二维码名称为必填项',
            },
          ]}
          width="md"
          name="name"
          label="二维码名称"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '二维码内容为必填项',
            },
          ]}
          width="md"
          name="content"
          label="二维码内容"
        />
        <ProFormSelect
          width="md"
          name="type"
          label="类型"
          options={[
            { label: '产品', value: 'product' },
            { label: '设备', value: 'equipment' },
            { label: '工序', value: 'process' },
          ]}
        />
        <ProFormSelect
          width="md"
          name="status"
          label="状态"
          options={[
            { label: '启用', value: 'active' },
            { label: '禁用', value: 'inactive' },
          ]}
        />
      </ModalForm>
      
      <ModalForm
        title="编辑二维码"
        width="400px"
        open={updateModalOpen}
        onOpenChange={handleUpdateModalOpen}
        initialValues={currentRow}
        onFinish={async (value) => {
          message.success('更新成功');
          handleUpdateModalOpen(false);
          setCurrentRow(undefined);
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '二维码名称为必填项',
            },
          ]}
          width="md"
          name="name"
          label="二维码名称"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '二维码内容为必填项',
            },
          ]}
          width="md"
          name="content"
          label="二维码内容"
        />
        <ProFormSelect
          width="md"
          name="type"
          label="类型"
          options={[
            { label: '产品', value: 'product' },
            { label: '设备', value: 'equipment' },
            { label: '工序', value: 'process' },
          ]}
        />
        <ProFormSelect
          width="md"
          name="status"
          label="状态"
          options={[
            { label: '启用', value: 'active' },
            { label: '禁用', value: 'inactive' },
          ]}
        />
      </ModalForm>

      <Modal
        title="二维码预览"
        open={previewModalOpen}
        onCancel={() => setPreviewModalOpen(false)}
        footer={[
          <Button key="export" type="primary" onClick={() => handleExportQR(currentRow!)}>
            <DownloadOutlined /> 导出二维码
          </Button>,
          <Button key="close" onClick={() => setPreviewModalOpen(false)}>
            关闭
          </Button>,
        ]}
      >
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ 
            width: '200px', 
            height: '200px', 
            border: '1px solid #d9d9d9', 
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fafafa'
          }}>
            <QrcodeOutlined style={{ fontSize: '100px', color: '#1890ff' }} />
          </div>
          <p>二维码内容: {currentRow?.content}</p>
          <p style={{ color: '#666', fontSize: '12px' }}>注：实际项目中这里会显示真实的二维码图片</p>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default QRCodeManagement;