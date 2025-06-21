import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';

type ProcessItem = {
  id: string;
  name: string;
  description: string;
  duration: number;
  sequence: number;
  createTime: string;
  updateTime: string;
};

const ProcessManagement: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<ProcessItem>();
  const actionRef = useRef<ActionType>();

  // 模拟数据
  const mockData: ProcessItem[] = [
    {
      id: '1',
      name: '原料准备',
      description: '准备生产所需的原材料',
      duration: 30,
      sequence: 1,
      createTime: '2023-12-01 10:00:00',
      updateTime: '2023-12-01 10:00:00',
    },
    {
      id: '2',
      name: '加工处理',
      description: '对原材料进行加工处理',
      duration: 120,
      sequence: 2,
      createTime: '2023-12-01 10:00:00',
      updateTime: '2023-12-01 10:00:00',
    },
  ];

  const columns: ProColumns<ProcessItem>[] = [
    {
      title: '工序名称',
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
      title: '工序描述',
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: '预计时长(分钟)',
      dataIndex: 'duration',
      valueType: 'digit',
    },
    {
      title: '工序顺序',
      dataIndex: 'sequence',
      valueType: 'digit',
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
          title="确定删除这个工序吗？"
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
      <ProTable<ProcessItem>
        headerTitle="工序管理"
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
            <PlusOutlined /> 新建工序
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
        title="新建工序"
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
              message: '工序名称为必填项',
            },
          ]}
          width="md"
          name="name"
          label="工序名称"
        />
        <ProFormTextArea
          width="md"
          name="description"
          label="工序描述"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '预计时长为必填项',
            },
          ]}
          width="md"
          name="duration"
          label="预计时长(分钟)"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '工序顺序为必填项',
            },
          ]}
          width="md"
          name="sequence"
          label="工序顺序"
        />
      </ModalForm>
      
      <ModalForm
        title="编辑工序"
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
              message: '工序名称为必填项',
            },
          ]}
          width="md"
          name="name"
          label="工序名称"
        />
        <ProFormTextArea
          width="md"
          name="description"
          label="工序描述"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '预计时长为必填项',
            },
          ]}
          width="md"
          name="duration"
          label="预计时长(分钟)"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '工序顺序为必填项',
            },
          ]}
          width="md"
          name="sequence"
          label="工序顺序"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default ProcessManagement;