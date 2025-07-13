import { PageContainer } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Badge, Tag } from 'antd';
import React from 'react';

type EquipmentOverviewItem = {
  id: string;
  name: string;
  status: 'running' | 'idle' | 'maintenance' | 'fault';
  processName: string;
  productionLineName: string;
  planStatus: 'normal' | 'delayed' | 'ahead' | 'paused';
  qrCodeCount: number;
};

const EquipmentOverview: React.FC = () => {
  const statusMap = {
    running: { text: '运行中', status: 'processing' as const },
    idle: { text: '空闲', status: 'default' as const },
    maintenance: { text: '维护中', status: 'warning' as const },
    fault: { text: '故障', status: 'error' as const },
  };

  const planStatusMap = {
    normal: { text: '正常', color: 'green' },
    delayed: { text: '延期', color: 'red' },
    ahead: { text: '提前', color: 'blue' },
    paused: { text: '暂停', color: 'orange' },
  };

  const columns: ProColumns<EquipmentOverviewItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      // valueType: 'indexBorder',
      width: 60,
      search: false,
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 150,
    },
    {
      title: '设备状态',
      dataIndex: 'status',
      width: 100,
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
      title: '所在工序',
      dataIndex: 'processName',
      ellipsis: true,
      width: 120,
      search: false,
    },
    {
      title: '所在产线',
      dataIndex: 'productionLineName',
      ellipsis: true,
      width: 120,
      search: false,
    },
    {
      title: '计划状态',
      dataIndex: 'planStatus',
      width: 100,
      render: (_, record) => (
        <Tag color={planStatusMap[record.planStatus].color}>
          {planStatusMap[record.planStatus].text}
        </Tag>
      ),
      valueEnum: {
        normal: { text: '正常', status: 'success' },
        delayed: { text: '延期', status: 'error' },
        ahead: { text: '提前', status: 'processing' },
        paused: { text: '暂停', status: 'warning' },
      },
    },
    {
      title: '二维码数量',
      dataIndex: 'qrCodeCount',
      width: 120,
      search: false,
      render: (text) => (
        <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
          {text}
        </span>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<EquipmentOverviewItem>
        headerTitle="设备状态概览"
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={async () => {
          // 模拟数据
          const mockData: EquipmentOverviewItem[] = [
            {
              id: '1',
              name: '成型机A',
              status: 'running',
              processName: '切割工序',
              productionLineName: '产线A',
              planStatus: 'normal',
              qrCodeCount: 1250,
            },
            {
              id: '2',
              name: '检测设备B',
              status: 'running',
              processName: '焊接工序',
              productionLineName: '产线B',
              planStatus: 'ahead',
              qrCodeCount: 980,
            },
            {
              id: '3',
              name: '运输带C',
              status: 'idle',
              processName: '打磨工序',
              productionLineName: '产线A',
              planStatus: 'normal',
              qrCodeCount: 0,
            },
            {
              id: '4',
              name: '包装机D',
              status: 'maintenance',
              processName: '包装工序',
              productionLineName: '产线C',
              planStatus: 'paused',
              qrCodeCount: 0,
            },
            {
              id: '5',
              name: '喷涂设备E',
              status: 'fault',
              processName: '喷涂工序',
              productionLineName: '产线B',
              planStatus: 'delayed',
              qrCodeCount: 0,
            },
            {
              id: '6',
              name: '焊接机F',
              status: 'running',
              processName: '焊接工序',
              productionLineName: '产线A',
              planStatus: 'normal',
              qrCodeCount: 2100,
            },
            {
              id: '7',
              name: '切割机G',
              status: 'running',
              processName: '切割工序',
              productionLineName: '产线C',
              planStatus: 'normal',
              qrCodeCount: 1800,
            },
            {
              id: '8',
              name: '质检设备H',
              status: 'idle',
              processName: '质检工序',
              productionLineName: '产线B',
              planStatus: 'normal',
              qrCodeCount: 0,
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
    </PageContainer>
  );
};

export default EquipmentOverview;