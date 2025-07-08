import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea,
  ProFormDigit,
  ProFormSelect,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm, Tag } from 'antd';
import React, { useRef, useState } from 'react';
// 从生产管理专门的API文件导入
import { 
  getProcessList, 
  addProcess, 
  updateProcess, 
  removeProcess 
} from '@/services/production/process';

type ProcessItem = {
  id?: string;
  name?: string;
  description?: string;
  sequence?: number;
  status?: number;
  createTime?: string;
  updateTime?: string;
  createBy?: string;
  updateBy?: string;
};

const ProcessManagement: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<ProcessItem>();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<ProcessItem>[] = [
    {
      title: '序号',
      dataIndex: 'sequence',
      valueType: 'indexBorder',
      width: 80,
      // render: (_, record) => record.sequence,
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
      title: '工序说明',
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
          onConfirm={async () => {
            try {
              await removeProcess(record.id!);
              message.success('删除成功');
              actionRef.current?.reload();
            } catch (error) {
              message.error('删除失败');
            }
          }}
          okText="确定"
          cancelText="取消"
        >
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  const handleCreate = async (values: ProcessItem) => {
    try {
      await addProcess(values);
      message.success('创建成功');
      handleModalOpen(false);
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error('创建失败');
      return false;
    }
  };

  const handleUpdate = async (values: ProcessItem) => {
    try {
      // 确保包含ID和更新的字段
      const updateData = {
        id: currentRow?.id,
        name: values.name,
        description: values.description,
        sequence: values.sequence,
      };
      await updateProcess(updateData);
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
        request={async (params) => {
          try {
            const response = await getProcessList({
              current: params.current,
              pageSize: params.pageSize,
              name: params.name,
              description: params.description,
            });
            
            console.log('API 响应:', response);
            
            // 根据实际接口返回结构解析数据
            const responseData = response.data || {};
            const records = responseData.records || [];
            
            return {
              data: records.map((item: any) => ({
                id: item.id,
                name: item.name,
                description: item.descript, // 注意：接口返回的是 descript
                sequence: item.sort, // 注意：接口返回的是 sort
                status: 1, // 接口没有返回状态，设置默认值
                createTime: item.createTime,
                updateTime: item.updateTime,
                createBy: item.operateName,
                updateBy: item.operateName,
              })),
              success: response.success !== false,
              total: responseData.total || 0,
            };
          } catch (error) {
            console.error('获取工序列表失败:', error);
            message.error('获取工序列表失败');
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
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
        key={currentRow?.id} // 添加 key 属性
        initialValues={{
          name: currentRow?.name,
          description: currentRow?.description,
          sequence: currentRow?.sequence,
        }}
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