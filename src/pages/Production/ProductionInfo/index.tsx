import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
  ProDescriptions,
} from '@ant-design/pro-components';
import { Button, Modal, Tag, QRCode } from 'antd';
import React, { useRef, useState } from 'react';

type ProductionInfoItem = {
  id: string;
  qrCode: string;
  qrCodeNumber: string;
  model: string;
  drawingNumber: string;
  trademark: string;
  productionTime: string;
  batchNumber: string;
  // 上沙后
  afterSandScanTime?: string;
  afterSandOperator?: string;
  // 瓷检后
  afterCeramicInspectionScanTime?: string;
  afterCeramicInspectionOperator?: string;
  // 水压检测前
  beforeWaterPressureTestScanTime?: string;
  beforeWaterPressureTestOperator?: string;
  // 水压检测后
  afterWaterPressureTestScanTime?: string;
  afterWaterPressureTestOperator?: string;
  // 胶装前
  beforeGluingScanTime?: string;
  beforeGluingOperator?: string;
  // 电检前
  beforeElectricalTestScanTime?: string;
  beforeElectricalTestOperator?: string;
  // 电检后
  afterElectricalTestScanTime?: string;
  afterElectricalTestOperator?: string;
  createTime: string;
};

const ProductionInfoManagement: React.FC = () => {
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<ProductionInfoItem>();
  const actionRef = useRef<ActionType>();

  // 模拟数据
  const mockData: ProductionInfoItem[] = [
    {
      id: '1',
      qrCode: 'QR001',
      qrCodeNumber: 'QRN20231201001',
      model: 'A1-Pro',
      drawingNumber: 'DWG-001',
      trademark: '智能品牌',
      productionTime: '2023-12-01 08:00:00',
      batchNumber: 'BATCH001',
      afterSandScanTime: '2023-12-01 09:00:00',
      afterSandOperator: '张三',
      afterCeramicInspectionScanTime: '2023-12-01 10:00:00',
      afterCeramicInspectionOperator: '李四',
      beforeWaterPressureTestScanTime: '2023-12-01 11:00:00',
      beforeWaterPressureTestOperator: '王五',
      afterWaterPressureTestScanTime: '2023-12-01 12:00:00',
      afterWaterPressureTestOperator: '赵六',
      beforeGluingScanTime: '2023-12-01 13:00:00',
      beforeGluingOperator: '钱七',
      beforeElectricalTestScanTime: '2023-12-01 14:00:00',
      beforeElectricalTestOperator: '孙八',
      afterElectricalTestScanTime: '2023-12-01 15:00:00',
      afterElectricalTestOperator: '周九',
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
      batchNumber: 'BATCH002',
      afterSandScanTime: '2023-12-01 15:00:00',
      afterSandOperator: '陈十',
      createTime: '2023-12-01 14:00:00',
    },
  ];

  const handleViewDetail = (record: ProductionInfoItem) => {
    setCurrentRow(record);
    setDetailModalOpen(true);
  };

  const columns: ProColumns<ProductionInfoItem>[] = [
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
          onClick={() => handleViewDetail(record)}
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
      title: '批次编号',
      dataIndex: 'batchNumber',
      width: 120,
      ellipsis: true,
    },
    {
      title: '上沙后扫码时间',
      dataIndex: 'afterSandScanTime',
      valueType: 'dateTime',
      width: 160,
    },
    {
      title: '上沙后操作人员',
      dataIndex: 'afterSandOperator',
      width: 120,
      ellipsis: true,
    },
    {
      title: '瓷检后扫码时间',
      dataIndex: 'afterCeramicInspectionScanTime',
      valueType: 'dateTime',
      width: 160,
    },
    {
      title: '瓷检后操作人员',
      dataIndex: 'afterCeramicInspectionOperator',
      width: 120,
      ellipsis: true,
    },
    {
      title: '水压检测前扫码时间',
      dataIndex: 'beforeWaterPressureTestScanTime',
      valueType: 'dateTime',
      width: 180,
    },
    {
      title: '水压检测前操作人员',
      dataIndex: 'beforeWaterPressureTestOperator',
      width: 140,
      ellipsis: true,
    },
    {
      title: '水压检测后扫码时间',
      dataIndex: 'afterWaterPressureTestScanTime',
      valueType: 'dateTime',
      width: 180,
    },
    {
      title: '水压检测后操作人员',
      dataIndex: 'afterWaterPressureTestOperator',
      width: 140,
      ellipsis: true,
    },
    {
      title: '胶装前扫码时间',
      dataIndex: 'beforeGluingScanTime',
      valueType: 'dateTime',
      width: 160,
    },
    {
      title: '胶装前操作人员',
      dataIndex: 'beforeGluingOperator',
      width: 120,
      ellipsis: true,
    },
    {
      title: '电检前扫码时间',
      dataIndex: 'beforeElectricalTestScanTime',
      valueType: 'dateTime',
      width: 160,
    },
    {
      title: '电检前操作人员',
      dataIndex: 'beforeElectricalTestOperator',
      width: 120,
      ellipsis: true,
    },
    {
      title: '电检后扫码时间',
      dataIndex: 'afterElectricalTestScanTime',
      valueType: 'dateTime',
      width: 160,
    },
    {
      title: '电检后操作人员',
      dataIndex: 'afterElectricalTestOperator',
      width: 120,
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 80,
      fixed: 'right',
      render: (_, record) => [
        <Button
          key="view"
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          查看
        </Button>,
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
        scroll={{ x: 2800 }}
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

      <Modal
        title="生产信息详情"
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            关闭
          </Button>,
        ]}
        width={1200}
      >
        {currentRow && (
          <ProDescriptions
            column={2}
            dataSource={currentRow}
            columns={[
              {
                title: '二维码',
                dataIndex: 'qrCode',
                render: () => (
                  <QRCode value={currentRow.qrCode} size={100} />
                ),
              },
              {
                title: '二维码编号',
                dataIndex: 'qrCodeNumber',
              },
              {
                title: '型号',
                dataIndex: 'model',
              },
              {
                title: '图号',
                dataIndex: 'drawingNumber',
              },
              {
                title: '商标',
                dataIndex: 'trademark',
              },
              {
                title: '生产时间',
                dataIndex: 'productionTime',
                valueType: 'dateTime',
              },
              {
                title: '批次编号',
                dataIndex: 'batchNumber',
              },
              {
                title: '上沙后扫码时间',
                dataIndex: 'afterSandScanTime',
                valueType: 'dateTime',
              },
              {
                title: '上沙后操作人员',
                dataIndex: 'afterSandOperator',
              },
              {
                title: '瓷检后扫码时间',
                dataIndex: 'afterCeramicInspectionScanTime',
                valueType: 'dateTime',
              },
              {
                title: '瓷检后操作人员',
                dataIndex: 'afterCeramicInspectionOperator',
              },
              {
                title: '水压检测前扫码时间',
                dataIndex: 'beforeWaterPressureTestScanTime',
                valueType: 'dateTime',
              },
              {
                title: '水压检测前操作人员',
                dataIndex: 'beforeWaterPressureTestOperator',
              },
              {
                title: '水压检测后扫码时间',
                dataIndex: 'afterWaterPressureTestScanTime',
                valueType: 'dateTime',
              },
              {
                title: '水压检测后操作人员',
                dataIndex: 'afterWaterPressureTestOperator',
              },
              {
                title: '胶装前扫码时间',
                dataIndex: 'beforeGluingScanTime',
                valueType: 'dateTime',
              },
              {
                title: '胶装前操作人员',
                dataIndex: 'beforeGluingOperator',
              },
              {
                title: '电检前扫码时间',
                dataIndex: 'beforeElectricalTestScanTime',
                valueType: 'dateTime',
              },
              {
                title: '电检前操作人员',
                dataIndex: 'beforeElectricalTestOperator',
              },
              {
                title: '电检后扫码时间',
                dataIndex: 'afterElectricalTestScanTime',
                valueType: 'dateTime',
              },
              {
                title: '电检后操作人员',
                dataIndex: 'afterElectricalTestOperator',
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