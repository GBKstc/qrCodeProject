import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormDateTimePicker,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm, QRCode } from 'antd';
import React, { useRef, useState } from 'react';

type DisplayItem = {
  id: string;
  qrCode: string;
  qrCodeNumber: string;
  model: string;
  drawingNumber: string;
  trademark: string;
  productionTime: string;
  displayProductionTime: string;
  batchNumber: string;
  displayBatchNumber: string;
  createTime: string;
};

const DisplayManagement: React.FC = () => {
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<DisplayItem>();
  const actionRef = useRef<ActionType>();

  // 模拟数据
  const mockData: DisplayItem[] = [
    {
      id: '1',
      qrCode: 'QR001',
      qrCodeNumber: 'QRN20231201001',
      model: 'A1-Pro',
      drawingNumber: 'DWG-001',
      trademark: '智能品牌',
      productionTime: '2023-12-01 08:00:00',
      displayProductionTime: '2023年12月1日 08:00',
      batchNumber: 'BATCH001',
      displayBatchNumber: '批次-001',
      createTime: '2023-12-01 08:00:00',
    },
    {
      id: '2',
      qrCode: 'QR002',
      qrCodeNumber: 'QRN20231201002',
      model: 'B2-Standard',
      drawingNumber: 'DWG-002',
      trademark: '科技品牌',
      productionTime: '2023-12-01 14:00:00',
      displayProductionTime: '2023年12月1日 14:00',
      batchNumber: 'BATCH002',
      displayBatchNumber: '批次-002',
      createTime: '2023-12-01 14:00:00',
    },
    {
      id: '3',
      qrCode: 'QR003',
      qrCodeNumber: 'QRN20231201003',
      model: 'C3-Premium',
      drawingNumber: 'DWG-003',
      trademark: '高端品牌',
      productionTime: '2023-12-01 16:00:00',
      displayProductionTime: '2023年12月1日 16:00',
      batchNumber: 'BATCH003',
      displayBatchNumber: '批次-003',
      createTime: '2023-12-01 16:00:00',
    },
  ];

  const handleEdit = (record: DisplayItem) => {
    setCurrentRow(record);
    handleUpdateModalOpen(true);
  };

  const handleDelete = (record: DisplayItem) => {
    message.success('删除成功');
    actionRef.current?.reload();
  };

  const columns: ProColumns<DisplayItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 60,
      fixed: 'left',
    },
    {
      title: '二维码',
      dataIndex: 'qrCode',
      width: 100,
      render: (_, record) => (
        <QRCode
          value={record.qrCode}
          size={50}
          style={{ cursor: 'pointer' }}
        />
      ),
    },
    {
      title: '二维码编号',
      dataIndex: 'qrCodeNumber',
      width: 150,
      ellipsis: true,
    },
    {
      title: '型号',
      dataIndex: 'model',
      width: 120,
      ellipsis: true,
    },
    {
      title: '图号',
      dataIndex: 'drawingNumber',
      width: 120,
      ellipsis: true,
    },
    {
      title: '商标',
      dataIndex: 'trademark',
      width: 120,
      ellipsis: true,
    },
    {
      title: '生产时间',
      dataIndex: 'productionTime',
      valueType: 'dateTime',
      width: 160,
    },
    {
      title: '展示生产时间',
      dataIndex: 'displayProductionTime',
      width: 160,
      ellipsis: true,
    },
    {
      title: '批次编号',
      dataIndex: 'batchNumber',
      width: 120,
      ellipsis: true,
    },
    {
      title: '展示批次编号',
      dataIndex: 'displayBatchNumber',
      width: 140,
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 120,
      fixed: 'right',
      render: (_, record) => [
        <Button
          key="edit"
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          编辑
        </Button>,
        <Popconfirm
          key="delete"
          title="确定删除这条记录吗？"
          onConfirm={() => handleDelete(record)}
          okText="确定"
          cancelText="取消"
        >
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
          >
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<DisplayItem>
        headerTitle="展示信息管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        scroll={{ x: 1400 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        request={async (params) => {
          // 模拟搜索过滤
          let filteredData = mockData;
          
          if (params.qrCodeNumber) {
            filteredData = filteredData.filter(item => 
              item.qrCodeNumber.includes(params.qrCodeNumber)
            );
          }
          
          if (params.model) {
            filteredData = filteredData.filter(item => 
              item.model.includes(params.model)
            );
          }
          
          if (params.batchNumber) {
            filteredData = filteredData.filter(item => 
              item.batchNumber.includes(params.batchNumber)
            );
          }

          return {
            data: filteredData,
            success: true,
            total: filteredData.length,
          };
        }}
        columns={columns}
      />
      
      <ModalForm
        title="编辑展示信息"
        width="600px"
        open={updateModalOpen}
        onOpenChange={handleUpdateModalOpen}
        initialValues={currentRow}
        onFinish={async (values) => {
          try {
            // 这里应该调用API更新数据
            console.log('更新数据:', { ...currentRow, ...values });
            message.success('更新成功');
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            actionRef.current?.reload();
            return true;
          } catch (error) {
            message.error('更新失败，请重试');
            return false;
          }
        }}
      >
        <ProFormText
          width="md"
          name="model"
          label="型号"
          readonly
          disabled
        />
        <ProFormText
          width="md"
          name="drawingNumber"
          label="图号"
          readonly
          disabled
        />
        <ProFormText
          width="md"
          name="trademark"
          label="商标"
          readonly
          disabled
        />
        <ProFormText
          width="md"
          name="batchNumber"
          label="批次编号"
          readonly
          disabled
        />
        <ProFormDateTimePicker
          width="md"
          name="productionTime"
          label="生产时间"
          readonly
          disabled
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '展示批次编号为必填项',
            },
          ]}
          width="md"
          name="displayBatchNumber"
          label="展示批次编号"
          placeholder="请输入展示批次编号"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '展示生产时间为必填项',
            },
          ]}
          width="md"
          name="displayProductionTime"
          label="展示生产时间"
          placeholder="请输入展示生产时间格式"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default DisplayManagement;

