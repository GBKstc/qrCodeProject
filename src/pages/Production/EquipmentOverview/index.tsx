import { PageContainer } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Badge } from 'antd';
import React from 'react';
import { request } from '@umijs/max';

type EquipmentOverviewItem = {
  id: number;
  name: string;
  status: number;
  productionProcessesName: string;
  qrcodeNum: number;
  [key: string]: any;
};

const EquipmentOverview: React.FC = () => {
  const statusMap = {
    0: { text: '离线', status: 0 },
    1: { text: '在线', status: 1 },
  };

  const columns: ProColumns<EquipmentOverviewItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
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
          status={statusMap[record.status]?.status || 'default'}
          text={statusMap[record.status]?.text || '未知'}
        />
      ),
      valueEnum: statusMap,
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      ellipsis: true,
      width: 120,
      search: false,
      valueEnum: {
        1: { text: '喷码机' },
        2: { text: 'PDA' },
      },
    },
    {
      title: '二维码数量',
      dataIndex: 'qrcodeNum',
      width: 120,
      search: false,
      render: (text) => (
        <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
          {text || 0}
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
        request={async (params) => {
          try {
            const response = await request('/api/daciDevice/pageList', {
              method: 'GET',
              params: {
                currPage: params.current || 1,
                pageSize: params.pageSize || 10,
                name: params.name,
                status: params.status,
              },
            });
            
            if (response.success) {
              return {
                data: response.data.records || [],
                success: true,
                total: response.data.total || 0,
              };
            } else {
              return {
                data: [],
                success: false,
                total: 0,
              };
            }
          } catch (error) {
            console.error('获取设备列表失败:', error);
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
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