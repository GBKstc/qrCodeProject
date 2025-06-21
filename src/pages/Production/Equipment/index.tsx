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
import { Button, message, Badge, Tag } from 'antd';
import React, { useRef, useState } from 'react';

type EquipmentItem = {
  id: string;
  name: string;
  code: string;
  type: string;
  model: string;
  status: 'running' | 'idle' | 'maintenance' | 'fault';
  location: string;
  description: string;
  lastMaintenance: string;
  nextMaintenance: string;
  createTime: string;
};

const EquipmentManagement: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const statusMap = {
    running: { text: '运行中', status: 'processing' as const },
    idle: { text: '空闲', status: 'default' as const },
    maintenance: { text: '维护中', status: 'warning' as const },
    fault: { text: '故障', status: 'error' as const },
  };

  const columns: ProColumns<EquipmentItem>[] = [
    {
      title: '设备名称',
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              // 查看详情逻辑
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '设备编号',
      dataIndex: 'code',
      copyable: true,
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      valueEnum: {
        production: { text: '生产设备' },
        testing: { text: '检测设备' },
        transport: { text: '运输设备' },
        auxiliary: { text: '辅助设备' },
      },
    },
    {
      title: '型号',
      dataIndex: 'model',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (_, record) => (
        <Badge
          status={statusMap[record.status].status}
          text={statusMap[record.status].text}
        />
      ),
      valueEnum: {
        running: { text: '运行中', status: 'processing' },
        idle: { text: '空闲', status: 'default' },
        maintenance: { text: '维护中', status: 'warning' },
        fault: { text: '故障', status: 'error' },
      },
    },
    {
      title: '位置',
      dataIndex: 'location',
      search: false,
    },
    {
      title: '下次维护',
      dataIndex: 'nextMaintenance',
      valueType: 'date',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a key="edit">编辑</a>,
        <a key="maintenance">维护记录</a>,
        <a key="status">状态变更</a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<EquipmentItem>
        headerTitle="设备管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button key="overview" onClick={() => window.open('/production/equipment/overview')}>
            设备状态概览
          </Button>,
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 新建设备
          </Button>,
        ]}
        request={async () => {
          // 模拟数据
          const mockData: EquipmentItem[] = [
            {
              id: '1',
              name: '成型机A',
              code: 'EQ001',
              type: 'production',
              model: 'XY-2000',
              status: 'running',
              location: '车间A-01',
              description: '主要用于产品成型加工',
              lastMaintenance: '2024-01-01',
              nextMaintenance: '2024-04-01',
              createTime: '2024-01-01 10:00:00',
            },
            {
              id: '2',
              name: '检测设备B',
              code: 'EQ002',
              type: 'testing',
              model: 'QC-500',
              status: 'idle',
              location: '车间B-02',
              description: '产品质量检测设备',
              lastMaintenance: '2024-01-15',
              nextMaintenance: '2024-04-15',
              createTime: '2024-01-01 10:00:00',
            },
          ];
          return {
            data: mockData,
            success: true,
            total: mockData.length,
          };
        }}
        columns={columns}
      />
      <ModalForm
        title="新建设备"
        width="600px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          message.success('创建成功');
          handleModalOpen(false);
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProFormText
          rules={[{ required: true, message: '设备名称为必填项' }]}
          width="md"
          name="name"
          label="设备名称"
        />
        <ProFormText
          rules={[{ required: true, message: '设备编号为必填项' }]}
          width="md"
          name="code"
          label="设备编号"
        />
        <ProFormSelect
          name="type"
          label="设备类型"
          width="md"
          options={[
            { label: '生产设备', value: 'production' },
            { label: '检测设备', value: 'testing' },
            { label: '运输设备', value: 'transport' },
            { label: '辅助设备', value: 'auxiliary' },
          ]}
          rules={[{ required: true, message: '请选择设备类型' }]}
        />
        <ProFormText
          width="md"
          name="model"
          label="设备型号"
        />
        <ProFormText
          width="md"
          name="location"
          label="设备位置"
        />
        <ProFormTextArea
          width="md"
          name="description"
          label="设备描述"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default EquipmentManagement;