import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea,
  ProFormDigit,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';

type ProcessItem = {
  id: string;
  name: string;
  description: string;
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
      sequence: 1,
      createTime: '2023-12-01 10:00:00',
      updateTime: '2023-12-01 10:00:00',
    },
    {
      id: '2',
      name: '加工处理',
      description: '对原材料进行加工处理',
      sequence: 2,
      createTime: '2023-12-01 10:00:00',
      updateTime: '2023-12-15 14:30:00',
    },
    {
      id: '3',
      name: '质量检测',
      description: '对加工后的产品进行质量检测',
      sequence: 3,
      createTime: '2023-12-02 09:00:00',
      updateTime: '2023-12-02 09:00:00',
    },
    {
      id: '4',
      name: '包装入库',
      description: '对合格产品进行包装并入库',
      sequence: 4,
      createTime: '2023-12-03 11:00:00',
      updateTime: '2023-12-10 16:20:00',
    },
  ];

  const columns: ProColumns<ProcessItem>[] = [
    {
      title: '序号',
      dataIndex: 'sequence',
      valueType: 'indexBorder',
      width: 80,
      render: (_, record) => record.sequence,
    },
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
      title: '工序管理',
      dataIndex: 'description',
      valueType: 'textarea',
      ellipsis: true,
      search: false,
    },
    {
      title: '设置时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 120,
      render: (_, record) => [
        <a
          key="edit"
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
          okText="确定"
          cancelText="取消"
        >
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  const handleCreate = async (values: any) => {
    try {
      // 这里应该调用API创建工序
      console.log('创建工序:', values);
      message.success('创建成功');
      handleModalOpen(false);
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error('创建失败');
      return false;
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      // 这里应该调用API更新工序
      console.log('更新工序:', values);
      message.success('更新成功');
      handleUpdateModalOpen(false);
      setCurrentRow(undefined);
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error('更新失败');
      return false;
    }
  };

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
        onFinish={handleCreate}
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
          placeholder="请输入工序名称"
        />
        <ProFormTextArea
          rules={[
            {
              required: true,
              message: '工序描述为必填项',
            },
          ]}
          width="md"
          name="description"
          label="工序描述"
          placeholder="请输入工序描述"
        />
        <ProFormDigit
          rules={[
            {
              required: true,
              message: '工序序号为必填项',
            },
          ]}
          width="md"
          name="sequence"
          label="工序序号"
          placeholder="请输入工序序号"
          min={1}
        />
      </ModalForm>
      
      <ModalForm
        title="编辑工序"
        width="400px"
        open={updateModalOpen}
        onOpenChange={handleUpdateModalOpen}
        initialValues={currentRow}
        onFinish={handleUpdate}
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
          placeholder="请输入工序名称"
        />
        <ProFormTextArea
          rules={[
            {
              required: true,
              message: '工序描述为必填项',
            },
          ]}
          width="md"
          name="description"
          label="工序描述"
          placeholder="请输入工序描述"
        />
        <ProFormDigit
          rules={[
            {
              required: true,
              message: '工序序号为必填项',
            },
          ]}
          width="md"
          name="sequence"
          label="工序序号"
          placeholder="请输入工序序号"
          min={1}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default ProcessManagement;