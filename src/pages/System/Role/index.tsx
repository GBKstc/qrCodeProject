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
import { Button, message, Popconfirm, Space, Switch, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { history } from 'umi';
import { getRoleList, addRole, updateRole, removeRole, batchRemoveRole, disableRole } from '@/services/system/role';

const RoleManagement: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [editModalOpen, handleEditModalOpen] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<API.RoleItem[]>([]);
  const [currentRecord, setCurrentRecord] = useState<API.RoleItem | undefined>();
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<API.RoleItem>[] = [
    {
      title: '角色编码',
      dataIndex: 'roleCode',
      // width: 120,
      hideInTable: false,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      // width: 150,
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
      title: '是否启用',
      dataIndex: 'status',
      width: 100,
      hideInSearch: true,
      render: (_, record) => (
        <Switch
          checked={record.status === 0}
          onChange={async (checked) => {
            try {
              await disableRole(record.id);
              message.success('状态更新成功');
              actionRef.current?.reload();
            } catch (error) {
              message.error('状态更新失败');
            }
          }}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      // width: 80,
      hideInSearch: true,
      render: (_, record) => (
        <Tag color={record.status === 0 ? 'green' : 'red'}>
          {record.status === 0 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '职能描述',
      dataIndex: 'remark',
      // width: 200,
      ellipsis: true,
      search: false,
    },
    {
      title: '操作人',
      dataIndex: 'operatorName',
      // width: 120,
      search: false,
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      // width: 160,
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      // width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => {
              // 跳转到权限管理页面，并传递角色信息
              history.push(`/system/role/permission?roleId=${record.id}&roleName=${encodeURIComponent(record.roleName || '')}&from=role`);
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
              try {
                if (record.id) {
                  // 使用编辑接口进行软删除
                  const result = await updateRole({
                    id: record.id,
                    roleCode: record.roleCode,
                    roleName: record.roleName,
                    companyId: record.companyId || 0,
                    del: 1, // 设置删除标记
                    authSaveParamList: record.authVOList?.map(auth => ({
                      menuId: auth.menuId,
                      roleId: record.id,
                    })) || [],
                  });
                  if (result.success) {
                    message.success('删除成功');
                    actionRef.current?.reload();
                  } else {
                    message.error(result.message || '删除失败');
                  }
                }
              } catch (error) {
                message.error('删除失败');
              }
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
      <ProTable<API.RoleItem>
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
          try {
            // 处理排序参数
            let sortType;
            let sortOrder;
            
            if (sort && Object.keys(sort).length > 0) {
              const sortKey = Object.keys(sort)[0];
              const sortValue = sort[sortKey];
              
              if (sortKey === 'createTime') {
                sortType = 1; // 1表示创建时间排序
                sortOrder = sortValue === 'ascend' ? 'asc' : 'desc';
              }
            }
            
            const response = await getRoleList({
              currPage: params.current || 1,
              pageSize: params.pageSize || 10,
              roleName: params.roleName,
              roleCode: params.roleCode,
              sortType: sortType,
              sortOrder: sortOrder,
              ...params,
            });
            
            if (response.success && response.data) {
              return {
                data: response.data.records || [],
                success: true,
                total: response.data.total || 0,
              };
            } else {
              message.error(response.message || '获取角色列表失败');
              return {
                data: [],
                success: false,
                total: 0,
              };
            }
          } catch (error) {
            message.error('获取角色列表失败');
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
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
              try {
                // 批量删除改为使用编辑接口
                const updatePromises = selectedRowsState.map(item => 
                  updateRole({
                    id: item.id,
                    roleCode: item.roleCode,
                    roleName: item.roleName,
                    companyId: item.companyId || 0,
                    del: 1, // 设置删除标记
                    authSaveParamList: item.authVOList?.map(auth => ({
                      menuId: auth.menuId,
                      roleId: item.id,
                    })) || [],
                  })
                );
                
                const results = await Promise.all(updatePromises);
                const allSuccess = results.every(result => result.success);
                
                if (allSuccess) {
                  message.success('批量删除成功');
                  setSelectedRows([]);
                  actionRef.current?.reloadAndRest?.();
                } else {
                  message.error('部分删除失败，请重试');
                }
              } catch (error) {
                message.error('批量删除失败');
              }
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
        key={createModalOpen ? 'create' : 'create-closed'}
        initialValues={{
          status: true, // 默认启用状态（对应后端的0）
        }}
        onFinish={async (value) => {
          try {
            const result = await addRole({
              roleCode: value.roleCode,
              roleName: value.roleName,
              remark: value.remark,
              companyId: 0,
              status: value.status ? 0 : 1, // true->0(启用), false->1(禁用)
              del: 0,
              authSaveParamList: [],
            });
            if (result.success) {
              message.success('创建成功');
              handleModalOpen(false);
              actionRef.current?.reload();
              return true;
            } else {
              message.error(result.message || '创建失败');
              return false;
            }
          } catch (error) {
            message.error('创建失败');
            return false;
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '角色编码为必填项',
            },
          ]}
          width="md"
          name="roleCode"
          label="角色编码"
          placeholder="请输入角色编码"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '角色名称为必填项',
            },
          ]}
          width="md"
          name="roleName"
          label="角色名称"
          placeholder="请输入角色名称"
        />
        <ProFormTextArea
          width="md"
          name="remark"
          label="职能描述"
          placeholder="请输入职能描述"
          fieldProps={{
            rows: 3,
          }}
        />
        {/* <ProFormSwitch
          name="status"
          label="是否启用"
          checkedChildren="启用"
          unCheckedChildren="禁用"
        /> */}
      </ModalForm>

      {/* 编辑角色弹窗 */}
      <ModalForm
        title="编辑角色"
        width="500px"
        open={editModalOpen}
        onOpenChange={handleEditModalOpen}
        initialValues={{
          roleCode: currentRecord?.roleCode,
          roleName: currentRecord?.roleName,
          remark: currentRecord?.remark,
          status: currentRecord?.status === 0, // 0->true(启用), 1->false(禁用)
        }}
        onFinish={async (value) => {
          try {
            const result = await updateRole({
              id: currentRecord?.id,
              roleCode: value.roleCode,
              roleName: value.roleName,
              remark: value.remark,
              companyId: currentRecord?.companyId || 0,
              status: value.status ? 0 : 1, // true->0(启用), false->1(禁用)
              del: 0,
              authSaveParamList: currentRecord?.authVOList?.map(auth => ({
                menuId: auth.menuId,
                roleId: currentRecord?.id,
              })) || [],
            });
            if (result.success) {
              message.success('编辑成功');
              handleEditModalOpen(false);
              actionRef.current?.reload();
              return true;
            } else {
              message.error(result.message || '编辑失败');
              return false;
            }
          } catch (error) {
            message.error('编辑失败');
            return false;
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '角色编码为必填项',
            },
          ]}
          width="md"
          name="roleCode"
          label="角色编码"
          placeholder="请输入角色编码"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '角色名称为必填项',
            },
          ]}
          width="md"
          name="roleName"
          label="角色名称"
          placeholder="请输入角色名称"
        />
        <ProFormTextArea
          width="md"
          name="remark"
          label="职能描述"
          placeholder="请输入职能描述"
          fieldProps={{
            rows: 3,
          }}
        />
        {/* <ProFormSwitch
          name="status"
          label="是否启用"
          checkedChildren="启用"
          unCheckedChildren="禁用"
        /> */}
      </ModalForm>
    </PageContainer>
  );
};

export default RoleManagement;
