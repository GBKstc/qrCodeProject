import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormSelect,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';

type EquipmentItem = {
  id: string;
  code: string;
  name: string;
  type: string;
  processId: string;
  processName: string;
  productionLineId: string;
  productionLineName: string;
  createTime: string;
};

const EquipmentManagement: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<EquipmentItem | undefined>();
  const actionRef = useRef<ActionType>();

  // 模拟工序数据
  const processOptions = [
    { label: '切割工序', value: '1' },
    { label: '焊接工序', value: '2' },
    { label: '打磨工序', value: '3' },
    { label: '喷涂工序', value: '4' },
    { label: '包装工序', value: '5' },
  ];

  // 模拟产线数据
  const productionLineOptions = [
    { label: '产线A', value: '1' },
    { label: '产线B', value: '2' },
    { label: '产线C', value: '3' },
  ];

  // 设备类型选项
  const equipmentTypeOptions = [
    { label: '生产设备', value: 'production' },
    { label: '检测设备', value: 'testing' },
    { label: '运输设备', value: 'transport' },
    { label: '辅助设备', value: 'auxiliary' },
  ];

  const handleCreate = async (values: any) => {
    try {
      console.log('创建设备:', values);
      message.success('设备创建成功');
      handleModalOpen(false);
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error('创建失败，请重试');
      return false;
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      console.log('更新设备:', { ...currentRecord, ...values });
      message.success('设备更新成功');
      setEditModalOpen(false);
      setCurrentRecord(undefined);
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error('更新失败，请重试');
      return false;
    }
  };

  const handleDelete = async (record: EquipmentItem) => {
    try {
      console.log('删除设备:', record.id);
      message.success('设备删除成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('删除失败，请重试');
    }
  };

  const columns: ProColumns<EquipmentItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 60,
      search: false,
    },
    {
      title: '设备编号',
      dataIndex: 'code',
      copyable: true,
      ellipsis: true,
      width: 120,
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 150,
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
      width: 100,
    },
    {
      title: '所属工序',
      dataIndex: 'processName',
      search: false,
      ellipsis: true,
      width: 120,
    },
    {
      title: '所属产线',
      dataIndex: 'productionLineName',
      search: false,
      ellipsis: true,
      width: 120,
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
            setCurrentRecord(record);
            setEditModalOpen(true);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="确认删除"
          description="确定要删除这个设备吗？"
          onConfirm={() => handleDelete(record)}
          okText="确认"
          cancelText="取消"
        >
          <a style={{ color: '#ff4d4f' }}>删除</a>
        </Popconfirm>,
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
              code: 'EQ001',
              name: '成型机A',
              type: 'production',
              processId: '1',
              processName: '切割工序',
              productionLineId: '1',
              productionLineName: '产线A',
              createTime: '2024-01-01 10:00:00',
            },
            {
              id: '2',
              code: 'EQ002',
              name: '检测设备B',
              type: 'testing',
              processId: '2',
              processName: '焊接工序',
              productionLineId: '2',
              productionLineName: '产线B',
              createTime: '2024-01-01 10:00:00',
            },
            {
              id: '3',
              code: 'EQ003',
              name: '运输带C',
              type: 'transport',
              processId: '3',
              processName: '打磨工序',
              productionLineId: '1',
              productionLineName: '产线A',
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
      
      {/* 新建设备表单 */}
      <ModalForm
        title="新建设备"
        width="600px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={handleCreate}
      >
        <ProFormText
          rules={[{ required: true, message: '设备编号为必填项' }]}
          width="md"
          name="code"
          label="设备编号"
          placeholder="请输入设备编号"
        />
        <ProFormText
          rules={[{ required: true, message: '设备名称为必填项' }]}
          width="md"
          name="name"
          label="设备名称"
          placeholder="请输入设备名称"
        />
        <ProFormSelect
          name="processId"
          label="关联工序"
          width="md"
          options={processOptions}
          rules={[{ required: true, message: '请选择关联工序' }]}
          placeholder="请选择关联工序"
        />
        <ProFormSelect
          name="productionLineId"
          label="关联产线"
          width="md"
          options={productionLineOptions}
          rules={[{ required: true, message: '请选择关联产线' }]}
          placeholder="请选择关联产线"
        />
        <ProFormSelect
          name="type"
          label="设备类型"
          width="md"
          options={equipmentTypeOptions}
          rules={[{ required: true, message: '请选择设备类型' }]}
          placeholder="请选择设备类型"
        />
      </ModalForm>

      {/* 编辑设备表单 */}
      <ModalForm
        title="编辑设备"
        width="600px"
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onFinish={handleUpdate}
        initialValues={currentRecord}
      >
        <ProFormText
          rules={[{ required: true, message: '设备编号为必填项' }]}
          width="md"
          name="code"
          label="设备编号"
          placeholder="请输入设备编号"
        />
        <ProFormText
          rules={[{ required: true, message: '设备名称为必填项' }]}
          width="md"
          name="name"
          label="设备名称"
          placeholder="请输入设备名称"
        />
        <ProFormSelect
          name="processId"
          label="关联工序"
          width="md"
          options={processOptions}
          rules={[{ required: true, message: '请选择关联工序' }]}
          placeholder="请选择关联工序"
        />
        <ProFormSelect
          name="productionLineId"
          label="关联产线"
          width="md"
          options={productionLineOptions}
          rules={[{ required: true, message: '请选择关联产线' }]}
          placeholder="请选择关联产线"
        />
        <ProFormSelect
          name="type"
          label="设备类型"
          width="md"
          options={equipmentTypeOptions}
          rules={[{ required: true, message: '请选择设备类型' }]}
          placeholder="请选择设备类型"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default EquipmentManagement;