import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm, Tag } from 'antd';
import React, { useRef, useState } from 'react';

type ProductItem = {
  id: string;
  name: string;
  model: string;
  category: string;
  description: string;
  status: 'active' | 'inactive';
  createTime: string;
  updateTime: string;
};

const ProductManagement: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<ProductItem>();
  const actionRef = useRef<ActionType>();

  // 模拟数据
  const mockData: ProductItem[] = [
    {
      id: '1',
      name: '智能手机A1',
      model: 'SM-A1-001',
      category: '电子产品',
      description: '高性能智能手机',
      status: 'active',
      createTime: '2023-12-01 10:00:00',
      updateTime: '2023-12-01 10:00:00',
    },
    {
      id: '2',
      name: '平板电脑B2',
      model: 'TB-B2-002',
      category: '电子产品',
      description: '轻薄便携平板电脑',
      status: 'active',
      createTime: '2023-12-01 10:00:00',
      updateTime: '2023-12-01 10:00:00',
    },
  ];

  const columns: ProColumns<ProductItem>[] = [
    {
      title: '产品名称',
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
      title: '产品型号',
      dataIndex: 'model',
    },
    {
      title: '产品类别',
      dataIndex: 'category',
    },
    {
      title: '产品描述',
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (_, record) => (
        <Tag color={record.status === 'active' ? 'green' : 'red'}>
          {record.status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
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
          title="确定删除这个产品吗？"
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
      <ProTable<ProductItem>
        headerTitle="产品管理"
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
            <PlusOutlined /> 新建产品
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
        title="新建产品"
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
              message: '产品名称为必填项',
            },
          ]}
          width="md"
          name="name"
          label="产品名称"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '产品型号为必填项',
            },
          ]}
          width="md"
          name="model"
          label="产品型号"
        />
        <ProFormText
          width="md"
          name="category"
          label="产品类别"
        />
        <ProFormTextArea
          width="md"
          name="description"
          label="产品描述"
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
        title="编辑产品"
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
              message: '产品名称为必填项',
            },
          ]}
          width="md"
          name="name"
          label="产品名称"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '产品型号为必填项',
            },
          ]}
          width="md"
          name="model"
          label="产品型号"
        />
        <ProFormText
          width="md"
          name="category"
          label="产品类别"
        />
        <ProFormTextArea
          width="md"
          name="description"
          label="产品描述"
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
    </PageContainer>
  );
};

export default ProductManagement;