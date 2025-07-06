import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormSelect,
  ProFormDigit,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import { getEquipmentList, saveOrUpdateEquipment, removeEquipment } from '@/services/production/equipment';

type EquipmentItem = {
  id: number;
  name: string;
  operateId?: number;
  operateName?: string;
  productionProcessesId?: number;
  productionProcessesName?: string;
  remark?: string;
  sort?: number;
  type?: number;
  createTime?: string;
  updateTime?: string;
};

const EquipmentManagement: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<EquipmentItem | undefined>();
  const actionRef = useRef<ActionType>();

  // 设备类型选项
  const equipmentTypeOptions = [
    { label: '喷码机', value: 1 },
    { label: '其他设备', value: 2 },
  ];

  const handleCreate = async (values: any) => {
    try {
      const response = await saveOrUpdateEquipment({
        name: values.name,
        type: values.type,
        productionProcessesId: values.productionProcessesId,
        sort: values.sort,
        remark: values.remark,
      });
      
      if (response.success) {
        message.success('设备创建成功');
        handleModalOpen(false);
        actionRef.current?.reload();
        return true;
      } else {
        message.error(response.message || '创建失败');
        return false;
      }
    } catch (error) {
      message.error('创建失败，请重试');
      return false;
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      const response = await saveOrUpdateEquipment({
        id: currentRecord?.id,
        name: values.name,
        type: values.type,
        productionProcessesId: values.productionProcessesId,
        sort: values.sort,
        remark: values.remark,
      });
      
      if (response.success) {
        message.success('设备更新成功');
        setEditModalOpen(false);
        setCurrentRecord(undefined);
        actionRef.current?.reload();
        return true;
      } else {
        message.error(response.message || '更新失败');
        return false;
      }
    } catch (error) {
      message.error('更新失败，请重试');
      return false;
    }
  };

  const handleDelete = async (record: EquipmentItem) => {
    try {
      const response = await removeEquipment(record.id);
      if (response.success) {
        message.success('设备删除成功');
        actionRef.current?.reload();
      } else {
        message.error(response.message || '删除失败');
      }
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
      title: '设备名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 150,
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      valueEnum: {
        1: { text: '喷码机' },
        2: { text: '其他设备' },
      },
      width: 100,
    },
    {
      title: '所属工序',
      dataIndex: 'productionProcessesName',
      search: false,
      ellipsis: true,
      width: 120,
    },
    {
      title: '操作人',
      dataIndex: 'operateName',
      search: false,
      ellipsis: true,
      width: 100,
    },
    {
      title: '序号',
      dataIndex: 'sort',
      search: false,
      width: 80,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      search: false,
      ellipsis: true,
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      search: false,
      valueType: 'dateTime',
      width: 150,
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
        request={async (params) => {
          try {
            const response = await getEquipmentList({
              currPage: params.current || 1,
              pageSize: params.pageSize || 10,
              name: params.name,
              type: params.type,
            });
            
            if (response.success && response.data) {
              return {
                data: Array.isArray(response.data.records) ? response.data.records : [],
                success: true,
                total: response.data.total || 0,
              };
            } else {
              console.error('API返回错误:', response.message);
              return {
                data: [],
                success: false,
                total: 0,
              };
            }
          } catch (error) {
            console.error('请求失败:', error);
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
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
          rules={[{ required: true, message: '设备名称为必填项' }]}
          width="md"
          name="name"
          label="设备名称"
          placeholder="请输入设备名称"
        />
        <ProFormSelect
          name="type"
          label="设备类型"
          width="md"
          options={equipmentTypeOptions}
          rules={[{ required: true, message: '请选择设备类型' }]}
          placeholder="请选择设备类型"
        />
        <ProFormDigit
          name="productionProcessesId"
          label="工序ID"
          width="md"
          placeholder="请输入工序ID"
        />
        <ProFormDigit
          name="sort"
          label="序号"
          width="md"
          placeholder="请输入序号"
        />
        <ProFormText
          name="remark"
          label="备注"
          width="md"
          placeholder="请输入备注"
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
          rules={[{ required: true, message: '设备名称为必填项' }]}
          width="md"
          name="name"
          label="设备名称"
          placeholder="请输入设备名称"
        />
        <ProFormSelect
          name="type"
          label="设备类型"
          width="md"
          options={equipmentTypeOptions}
          rules={[{ required: true, message: '请选择设备类型' }]}
          placeholder="请选择设备类型"
        />
        <ProFormDigit
          name="productionProcessesId"
          label="工序ID"
          width="md"
          placeholder="请输入工序ID"
        />
        <ProFormDigit
          name="sort"
          label="序号"
          width="md"
          placeholder="请输入序号"
        />
        <ProFormText
          name="remark"
          label="备注"
          width="md"
          placeholder="请输入备注"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default EquipmentManagement;