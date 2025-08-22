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
import React, { useRef, useState, useEffect } from 'react';
import { getEquipmentList, saveOrUpdateEquipment, removeEquipment } from '@/services/production/equipment';
import { getAllProcesses } from '@/services/production/process';

type EquipmentItem = {
  id: number;
  code?: string;
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
  const [processOptions, setProcessOptions] = useState<any[]>([]);
  const actionRef = useRef<ActionType>();

  // 设备类型选项 - 修改为喷码机和PDA
  const equipmentTypeOptions = [
    { label: '喷码机', value: 1 },
    { label: 'PDA', value: 2 },
  ];

  // 获取工序选项
  const fetchProcessOptions = async () => {
    try {
      const response = await getAllProcesses();
      if (response.success && response.data?.records) {
        const options = response.data.records.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
        setProcessOptions(options);
      }
    } catch (error) {
      console.error('获取工序列表失败:', error);
    }
  };

  // 初始化工序选项
  useEffect(() => {
    fetchProcessOptions();
  }, []);

  const handleCreate = async (values: any) => {
    try {
      const response = await saveOrUpdateEquipment({
        code: values.code,
        name: values.name,
        // type: values.type,
        type:1,
        productionProcessesId: values.productionProcessesId,
      });
      
      if (response.success) {
        message.success('设备创建成功');
        handleModalOpen(false);
        actionRef.current?.reload();
        return true;
      } else {
        // message.error(response.message || '创建失败');
        return false;
      }
    } catch (error) {
      // message.error('创建失败，请重试');
      return false;
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      const response = await saveOrUpdateEquipment({
        id: currentRecord?.id,
        code: values.code,
        name: values.name,
        // type: values.type,
        type:1,
        productionProcessesId: values.productionProcessesId,
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
      valueType: 'index',
      width: 60,
      search: false,
    },
    {
      title: '设备编号',
      dataIndex: 'code',
      ellipsis: true,
      width: 120,
      search: false, // 移除设备编号搜索
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 150,
      search: false, // 移除设备名称搜索
    },
    // {
    //   title: '工序',
    //   dataIndex: 'productionProcessesName',
    //   ellipsis: true,
    //   width: 120,
    //   // 支持模糊搜索
    // },
  
    // {
    //   title: '设备类型',
    //   dataIndex: 'type',
    //   valueEnum: {
    //     1: { text: '喷码机' },
    //     2: { text: 'PDA' },
    //   },
    //   width: 100,
    //   // 下拉选择搜索
    // },
    {
      title: '关联工序',
      dataIndex: 'productionProcessesName',
      ellipsis: true,
      width: 120,
      valueType: 'select',
      fieldProps: {
        options: processOptions,
        placeholder: '请选择关联工序',
      },
      search: {
        transform: (value) => ({ productionProcessesId: value }),
      },
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
              productionProcessesId: params.productionProcessesId, // 工序搜索
              productionLineName: params.productionLineName, // 产线搜索
              type: params.type, // 设备类型搜索
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
        key={createModalOpen ? 'create' : 'create-closed'} // 添加 key 属性强制重新渲染
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
          name="productionProcessesId"
          label="关联工序"
          width="md"
          options={processOptions}
          rules={[{ required: true, message: '请选择关联工序' }]}
          placeholder="请选择关联工序"
        />
        {/* <ProFormSelect
          name="type"
          label="设备类型"
          width="md"
          options={equipmentTypeOptions}
          rules={[{ required: true, message: '请选择设备类型' }]}
          placeholder="请选择设备类型"
        /> */}
      </ModalForm>

      {/* 编辑设备表单 */}
      <ModalForm
        title="编辑设备"
        width="600px"
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onFinish={handleUpdate}
        initialValues={currentRecord}
        key={currentRecord?.id} // 添加 key 属性
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
          name="productionProcessesId"
          label="关联工序"
          width="md"
          options={processOptions}
          rules={[{ required: true, message: '请选择关联工序' }]}
          placeholder="请选择关联工序"
        />
        {/* <ProFormSelect
          name="type"
          label="设备类型"
          width="md"
          options={equipmentTypeOptions}
          rules={[{ required: true, message: '请选择设备类型' }]}
          placeholder="请选择设备类型"
        /> */}
      </ModalForm>
    </PageContainer>
  );
};

export default EquipmentManagement;