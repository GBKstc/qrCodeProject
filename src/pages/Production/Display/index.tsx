import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
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
import { getDisplayList, saveOrUpdateDisplay, removeDisplay } from '@/services/production/display';

type DisplayItem = {
  id?: number;
  code?: string;
  name?: string;
  isShow?: number;
  operateId?: number;
  operateName?: string;
  remark?: string;
  createTime?: string;
  updateTime?: string;
};

const DisplayManagement: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<DisplayItem>();
  const actionRef = useRef<ActionType>();

  const handleCreate = async (values: any) => {
    try {
      await saveOrUpdateDisplay({
        code: values.code,
        name: values.name,
        isShow: values.isShow,
        operateId: values.operateId || 0,
        operateName: values.operateName || '',
        remark: values.remark || '',
      });
      message.success('创建成功');
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
      await saveOrUpdateDisplay({
        id: currentRow?.id,
        code: values.code,
        name: values.name,
        isShow: values.isShow,
        operateId: values.operateId || 0,
        operateName: values.operateName || '',
        remark: values.remark || '',
      });
      message.success('更新成功');
      handleUpdateModalOpen(false);
      setCurrentRow(undefined);
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error('更新失败，请重试');
      return false;
    }
  };

  const handleDelete = async (record: DisplayItem) => {
    try {
      if (record.id) {
        await removeDisplay(record.id);
        message.success('删除成功');
        actionRef.current?.reload();
      }
    } catch (error) {
      message.error('删除失败，请重试');
    }
  };

  const handleEdit = (record: DisplayItem) => {
    setCurrentRow(record);
    handleUpdateModalOpen(true);
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
      title: '字段编号',
      dataIndex: 'code',
      width: 120,
      ellipsis: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 150,
      ellipsis: true,
    },
    {
      title: '是否展示',
      dataIndex: 'isShow',
      width: 100,
      valueEnum: {
        0: { text: '不展示', status: 'Default' },
        1: { text: '展示', status: 'Success' },
      },
    },
    {
      title: '操作人',
      dataIndex: 'operateName',
      width: 120,
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 200,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 160,
      search: false,
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
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            新建
          </Button>,
        ]}
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        request={async (params) => {
          const response = await getDisplayList({
            currPage: params.current,
            pageSize: params.pageSize,
            code: params.code,
            name: params.name,
            isShow: params.isShow,
            operateId: params.operateId,
            operateName: params.operateName,
            remark: params.remark,
          });
          
          return {
            data: response.data?.records || [],
            success: response.success,
            total: response.data?.total || 0,
          };
        }}
        columns={columns}
      />
      
      <ModalForm
        title="新建展示信息"
        width="600px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={handleCreate}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '字段编号为必填项',
            },
          ]}
          width="md"
          name="code"
          label="字段编号"
          placeholder="请输入字段编号"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '名称为必填项',
            },
          ]}
          width="md"
          name="name"
          label="名称"
          placeholder="请输入名称"
        />
        <ProFormSelect
          width="md"
          name="isShow"
          label="是否展示"
          placeholder="请选择是否展示"
          options={[
            { label: '不展示', value: 0 },
            { label: '展示', value: 1 },
          ]}
          rules={[
            {
              required: true,
              message: '请选择是否展示',
            },
          ]}
        />
        <ProFormText
          width="md"
          name="operateName"
          label="操作人名称"
          placeholder="请输入操作人名称"
        />
        <ProFormText
          width="md"
          name="remark"
          label="备注"
          placeholder="请输入备注"
        />
      </ModalForm>
      
      <ModalForm
        title="编辑展示信息"
        width="600px"
        open={updateModalOpen}
        onOpenChange={handleUpdateModalOpen}
        initialValues={currentRow}
        onFinish={handleUpdate}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '字段编号为必填项',
            },
          ]}
          width="md"
          name="code"
          label="字段编号"
          placeholder="请输入字段编号"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '名称为必填项',
            },
          ]}
          width="md"
          name="name"
          label="名称"
          placeholder="请输入名称"
        />
        <ProFormSelect
          width="md"
          name="isShow"
          label="是否展示"
          placeholder="请选择是否展示"
          options={[
            { label: '不展示', value: 0 },
            { label: '展示', value: 1 },
          ]}
          rules={[
            {
              required: true,
              message: '请选择是否展示',
            },
          ]}
        />
        <ProFormText
          width="md"
          name="operateName"
          label="操作人名称"
          placeholder="请输入操作人名称"
        />
        <ProFormText
          width="md"
          name="remark"
          label="备注"
          placeholder="请输入备注"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default DisplayManagement;

