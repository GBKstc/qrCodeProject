import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
  ProFormDateTimePicker,
  ProTable,
  ProDescriptions,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm, Modal, Tag } from 'antd';
import React, { useRef, useState } from 'react';

type ProductionInfoItem = {
  id: string;
  batchNo: string;
  productName: string;
  processName: string;
  equipmentName: string;
  operator: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  quantity: number;
  qualifiedQuantity: number;
  remarks: string;
  createTime: string;
};

const ProductionInfoManagement: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<ProductionInfoItem>();
  const actionRef = useRef<ActionType>();

  // 模拟数据
  const mockData: ProductionInfoItem[] = [
    {
      id: '1',
      batchNo: 'BATCH001',
      productName: '智能手机A1',
      processName: '组装工序',
      equipmentName: '自动组装线A',
      operator: '张三',
      startTime: '2023-12-01 08:00:00',
      endTime: '2023-12-01 12:00:00',
      status: 'completed',
      quantity: 100,
      qualifiedQuantity: 98,
      remarks: '正常生产',
      createTime: '2023-12-01 08:00:00',
    },
    {
      id: '2',
      batchNo: 'BATCH002',
      productName: '平板电脑B2',
      processName: '测试工序',
      equipmentName: '自动测试设备B',
      operator: '李四',
      startTime: '2023-12-01 14:00:00',
      endTime: '',
      status: 'processing',
      quantity: 50,
      qualifiedQuantity: 0,
      remarks: '进行中',
      createTime: '2023-12-01 14:00:00',
    },
  ];

  const handleViewDetail = (record: ProductionInfoItem) => {
    setCurrentRow(record);
    setDetailModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      pending: 'default',
      processing: 'processing',
      completed: 'success',
      failed: 'error',
    };
    return colorMap[status as keyof typeof colorMap] || 'default';
  };

  const getStatusText = (status: string) => {
    const textMap = {
      pending: '待开始',
      processing: '进行中',
      completed: '已完成',
      failed: '失败',
    };
    return textMap[status as keyof typeof textMap] || status;
  };

  const columns: ProColumns<ProductionInfoItem>[] = [
    {
      title: '批次号',
      dataIndex: 'batchNo',
      render: (dom, entity) => {
        return (
          <a onClick={() => handleViewDetail(entity)}>
            {dom}
          </a>
        );
      },
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
    },
    {
      title: '工序名称',
      dataIndex: 'processName',
    },
    {
      title: '设备名称',
      dataIndex: 'equipmentName',
    },
    {
      title: '操作员',
      dataIndex: 'operator',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (_, record) => (
        <Tag color={getStatusColor(record.status)}>
          {getStatusText(record.status)}
        </Tag>
      ),
    },
    {
      title: '生产数量',
      dataIndex: 'quantity',
    },
    {
      title: '合格数量',
      dataIndex: 'qualifiedQuantity',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="detail"
          onClick={() => handleViewDetail(record)}
        >
          <EyeOutlined /> 详情
        </a>,
        <Popconfirm
          key="delete"
          title="确定删除这条生产信息吗？"
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
      <ProTable<ProductionInfoItem>
        headerTitle="生产信息管理"
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
            <PlusOutlined /> 新建生产信息
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
        title="新建生产信息"
        width="600px"
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
              message: '批次号为必填项',
            },
          ]}
          width="md"
          name="batchNo"
          label="批次号"
        />
        <ProFormSelect
          width="md"
          name="productName"
          label="产品名称"
          options={[
            { label: '智能手机A1', value: '智能手机A1' },
            { label: '平板电脑B2', value: '平板电脑B2' },
          ]}
        />
        <ProFormSelect
          width="md"
          name="processName"
          label="工序名称"
          options={[
            { label: '原料准备', value: '原料准备' },
            { label: '加工处理', value: '加工处理' },
            { label: '组装工序', value: '组装工序' },
            { label: '测试工序', value: '测试工序' },
          ]}
        />
        <ProFormSelect
          width="md"
          name="equipmentName"
          label="设备名称"
          options={[
            { label: '自动组装线A', value: '自动组装线A' },
            { label: '自动测试设备B', value: '自动测试设备B' },
          ]}
        />
        <ProFormText
          width="md"
          name="operator"
          label="操作员"
        />
        <ProFormText
          width="md"
          name="quantity"
          label="生产数量"
        />
        <ProFormDateTimePicker
          width="md"
          name="startTime"
          label="开始时间"
        />
        <ProFormTextArea
          width="md"
          name="remarks"
          label="备注"
        />
      </ModalForm>

      <Modal
        title="生产信息详情"
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {currentRow && (
          <ProDescriptions
            column={2}
            dataSource={currentRow}
            columns={[
              {
                title: '批次号',
                dataIndex: 'batchNo',
              },
              {
                title: '产品名称',
                dataIndex: 'productName',
              },
              {
                title: '工序名称',
                dataIndex: 'processName',
              },
              {
                title: '设备名称',
                dataIndex: 'equipmentName',
              },
              {
                title: '操作员',
                dataIndex: 'operator',
              },
              {
                title: '状态',
                dataIndex: 'status',
                render: (_, record) => (
                  <Tag color={getStatusColor(record.status)}>
                    {getStatusText(record.status)}
                  </Tag>
                ),
              },
              {
                title: '生产数量',
                dataIndex: 'quantity',
              },
              {
                title: '合格数量',
                dataIndex: 'qualifiedQuantity',
              },
              {
                title: '开始时间',
                dataIndex: 'startTime',
                valueType: 'dateTime',
              },
              {
                title: '结束时间',
                dataIndex: 'endTime',
                valueType: 'dateTime',
              },
              {
                title: '备注',
                dataIndex: 'remarks',
                span: 2,
              },
              {
                title: '创建时间',
                dataIndex: 'createTime',
                valueType: 'dateTime',
                span: 2,
              },
            ]}
          />
        )}
      </Modal>
    </PageContainer>
  );
};

export default ProductionInfoManagement;