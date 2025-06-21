import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea,
  ProFormSwitch,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { history } from 'umi';

type RoleItem = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createTime: string;
  updateTime: string;
  enabled: boolean;
};

const RoleManagement: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [editModalOpen, handleEditModalOpen] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<RoleItem[]>([]);
  const [currentRecord, setCurrentRecord] = useState<RoleItem | undefined>();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<RoleItem>[] = [
    {
      title: '角色名称',
      dataIndex: 'name',
      width: 120,
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRecord(entity);
              // 查看详情逻辑
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '职能描述',
      dataIndex: 'description',
      width: 200,
      ellipsis: true,
    },
    {
      title: '添加时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 160,
      search: false,
    },
    {
      title: '是否启用',
      dataIndex: 'enabled',
      width: 100,
      search: false,
      render: (_, record) => (
        <Tag color={record.enabled ? 'green' : 'red'}>
          {record.enabled ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => {
              // 跳转到权限管理页面，并传递角色信息
              history.push(`/system/role/permission?roleId=${record.id}&roleName=${encodeURIComponent(record.name)}&from=role`);
            }}
          >
            权限设置
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setCurrentRecord(record);
              handleEditModalOpen(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个角色吗？"
            onConfirm={async () => {
              // 删除逻辑
              message.success('删除成功');
              actionRef.current?.reload();
            }}
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<RoleItem>
        headerTitle="角色管理"
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
            <PlusOutlined /> 新建角色
          </Button>,
        ]}
        request={async (params, sort, filter) => {
          // 模拟数据请求
          const mockData: RoleItem[] = [
            {
              id: '1',
              name: '系统管理员',
              description: '系统管理员，拥有所有权限，负责系统配置和用户管理',
              permissions: ['user:read', 'user:write', 'role:read', 'role:write'],
              createTime: '2024-01-01 10:00:00',
              updateTime: '2024-01-01 10:00:00',
              enabled: true,
            },
            {
              id: '2',
              name: '生产操作员',
              description: '生产操作员，拥有生产相关权限，负责生产流程管理',
              permissions: ['production:read', 'production:write'],
              createTime: '2024-01-02 10:00:00',
              updateTime: '2024-01-02 10:00:00',
              enabled: true,
            },
            {
              id: '3',
              name: '质检员',
              description: '质检员，负责产品质量检查和数据记录',
              permissions: ['production:read'],
              createTime: '2024-01-03 10:00:00',
              updateTime: '2024-01-03 10:00:00',
              enabled: false,
            },
          ];
          return {
            data: mockData,
            success: true,
            total: mockData.length,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项
            </div>
          }
        >
          <Button
            onClick={async () => {
              // 批量删除逻辑
              message.success('批量删除成功');
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      
      {/* 新建角色弹窗 */}
      <ModalForm
        title="新建角色"
        width="500px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          // 创建角色逻辑
          console.log('创建角色:', value);
          message.success('创建成功');
          handleModalOpen(false);
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '角色名称为必填项',
            },
          ]}
          width="md"
          name="name"
          label="角色名称"
          placeholder="请输入角色名称"
        />
        <ProFormTextArea
          width="md"
          name="description"
          label="职能描述"
          placeholder="请输入角色职能描述"
          rules={[
            {
              required: true,
              message: '职能描述为必填项',
            },
          ]}
        />
        <ProFormSwitch
          name="enabled"
          label="是否启用"
          initialValue={true}
        />
      </ModalForm>

      {/* 编辑角色弹窗 */}
      <ModalForm
        title="编辑角色"
        width="500px"
        open={editModalOpen}
        onOpenChange={handleEditModalOpen}
        initialValues={currentRecord}
        onFinish={async (value) => {
          // 编辑角色逻辑
          console.log('编辑角色:', value);
          message.success('编辑成功');
          handleEditModalOpen(false);
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '角色名称为必填项',
            },
          ]}
          width="md"
          name="name"
          label="角色名称"
          placeholder="请输入角色名称"
        />
        <ProFormTextArea
          width="md"
          name="description"
          label="职能描述"
          placeholder="请输入角色职能描述"
          rules={[
            {
              required: true,
              message: '职能描述为必填项',
            },
          ]}
        />
        <ProFormSwitch
          name="enabled"
          label="是否启用"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default RoleManagement;
