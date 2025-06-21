import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormSelect,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Tag, Avatar, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';

type AccountItem = {
  id: string;
  username: string;
  email: string;
  phone: string;
  realName: string;
  department: string;
  roles: string[];
  status: 'active' | 'inactive';
  createTime: string;
  lastLoginTime: string;
};

const AccountManagement: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<AccountItem>[] = [
    {
      title: '成员账号',
      dataIndex: 'username',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar>{record.realName?.charAt(0) || record.username.charAt(0)}</Avatar>
          <div>
            <div>@{record.username}</div>
          </div>
        </div>
      ),
    },
    {
      title: '姓名',
      dataIndex: 'realName',
    },
    {
      title: '邮箱地址',
      dataIndex: 'email',
      copyable: true,
      search: false,
    },
    {
      title: '所属部门',
      dataIndex: 'department',
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastLoginTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '是否启用',
      dataIndex: 'status',
      valueEnum: {
        active: {
          text: '启用',
          status: 'Success',
        },
        inactive: {
          text: '禁用',
          status: 'Error',
        },
      },
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a key="edit">编辑</a>,
        <Popconfirm
          key="delete"
          title="确定要删除这个账号吗？"
          onConfirm={() => {
            message.success('删除成功');
            actionRef.current?.reload();
          }}
          okText="确定"
          cancelText="取消"
        >
          <a style={{ color: 'red' }}>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<AccountItem>
        headerTitle="账号管理"
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
            <PlusOutlined /> 新建账号
          </Button>,
        ]}
        request={async () => {
          // 模拟数据
          const mockData: AccountItem[] = [
            {
              id: '1',
              username: 'admin',
              email: 'admin@example.com',
              phone: '13800138000',
              realName: '系统管理员',
              department: '信息技术部',
              roles: ['管理员'],
              status: 'active',
              createTime: '2024-01-01 10:00:00',
              lastLoginTime: '2024-01-15 09:30:00',
            },
            {
              id: '2',
              username: 'operator',
              email: 'operator@example.com',
              phone: '13800138001',
              realName: '操作员',
              department: '生产部',
              roles: ['操作员'],
              status: 'active',
              createTime: '2024-01-02 10:00:00',
              lastLoginTime: '2024-01-15 08:45:00',
            },
            {
              id: '3',
              username: 'viewer',
              email: 'viewer@example.com',
              phone: '13800138002',
              realName: '查看员',
              department: '质量部',
              roles: ['查看者'],
              status: 'inactive',
              createTime: '2024-01-03 10:00:00',
              lastLoginTime: '2024-01-10 16:20:00',
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
      <ModalForm
        title="新建账号"
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          message.success('创建成功');
          handleModalOpen(false);
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProFormText
          rules={[{ required: true, message: '用户名为必填项' }]}
          width="md"
          name="username"
          label="用户名"
        />
        <ProFormText
          rules={[{ required: true, message: '真实姓名为必填项' }]}
          width="md"
          name="realName"
          label="真实姓名"
        />
        <ProFormText
          rules={[
            { required: true, message: '邮箱为必填项' },
            { type: 'email', message: '请输入正确的邮箱格式' },
          ]}
          width="md"
          name="email"
          label="邮箱"
        />
        <ProFormText
          rules={[{ required: true, message: '手机号为必填项' }]}
          width="md"
          name="phone"
          label="手机号"
        />
        <ProFormText
          rules={[{ required: true, message: '所属部门为必填项' }]}
          width="md"
          name="department"
          label="所属部门"
        />
        <ProFormSelect
          name="roles"
          label="角色"
          width="md"
          mode="multiple"
          options={[
            { label: '管理员', value: 'admin' },
            { label: '操作员', value: 'operator' },
            { label: '查看者', value: 'viewer' },
          ]}
          rules={[{ required: true, message: '请选择角色' }]}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default AccountManagement;