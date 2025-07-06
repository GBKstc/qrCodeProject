import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, message, Switch, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { getAccountList, addAccount, updateAccount, removeAccount, batchRemoveAccount } from '@/services/system/account';
import { getAllRoles } from '@/services/system/role';

const AccountList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.AccountItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.AccountItem[]>([]);
  const [roleOptions, setRoleOptions] = useState<{ label: string; value: number }[]>([]);
  const intl = useIntl();

  // 获取角色选项
  const fetchRoleOptions = async () => {
    try {
      const response = await getAllRoles();
      if (response.success && response.data) {
        const options = response.data.map((role: API.RoleItem) => ({
          label: role.roleName || '',
          value: role.id || 0,
        }));
        setRoleOptions(options);
      }
    } catch (error) {
      console.error('获取角色列表失败:', error);
    }
  };

  React.useEffect(() => {
    fetchRoleOptions();
  }, []);

  const columns: ProColumns<API.AccountItem>[] = [
    {
      title: '成员账户',
      dataIndex: 'mobile',
      tip: '账户手机号',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '所属权限（角色）',
      dataIndex: 'authVOList',
      hideInSearch: true,
      render: (_, record) => {
        if (!record.authVOList || record.authVOList.length === 0) {
          return <Tag color="default">暂无角色</Tag>;
        }
        return (
          <>
            {record.authVOList.map((role: any, index: number) => (
              <Tag color="blue" key={index}>
                {role.roleName}
              </Tag>
            ))}
          </>
        );
      },
    },
    {
      title: '添加时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '最后登录时间',
      sorter: true,
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '是否启用',
      dataIndex: 'del',
      hideInForm: true,
      hideInSearch: true,
      render: (_, record) => (
        <Switch
          checked={record.del === 0}
          onChange={async (checked) => {
            try {
              await updateAccount({
                ...record,
                del: checked ? 0 : 1,
              });
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
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.config" defaultMessage="编辑" />
        </a>,
        <a
          key="delete"
          onClick={async () => {
            try {
              await removeAccount(record.id!);
              message.success('删除成功');
              actionRef.current?.reload();
            } catch (error) {
              message.error('删除失败');
            }
          }}
        >
          <FormattedMessage id="pages.searchTable.delete" defaultMessage="删除" />
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.AccountItem, API.AccountPageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: '查询表格',
        })}
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
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="新建" />
          </Button>,
        ]}
        request={async (params) => {
          try {
            const response = await getAccountList({
              ...params,
              currPage: params.current,
              pageSize: params.pageSize,
            });
            
            if (response.success) {
              return {
                data: response.data?.records || [],
                success: true,
                total: response.data?.total || 0,
              };
            }
            return {
              data: [],
              success: false,
              total: 0,
            };
          } catch (error) {
            message.error('获取账户列表失败');
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            background: '#fff',
            padding: '16px',
            boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <FormattedMessage
            id="pages.searchTable.chosen"
            defaultMessage="已选择"
            values={{ count: selectedRowsState.length }}
          />
          <Button
            type="primary"
            danger
            style={{ marginLeft: 8 }}
            onClick={async () => {
              try {
                const ids = selectedRowsState.map((row) => row.id!).filter(Boolean);
                await batchRemoveAccount(ids);
                setSelectedRows([]);
                actionRef.current?.reloadAndRest?.();
                message.success('批量删除成功');
              } catch (error) {
                message.error('批量删除失败');
              }
            }}
          >
            <FormattedMessage id="pages.searchTable.batchDeletion" defaultMessage="批量删除" />
          </Button>
        </div>
      )}
      
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.newAccount',
          defaultMessage: '新建账户',
        })}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          try {
            await addAccount(value as API.AccountSaveParam);
            handleModalOpen(false);
            message.success('添加成功');
            if (actionRef.current) {
              actionRef.current.reload();
            }
            return true;
          } catch (error) {
            message.error('添加失败');
            return false;
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '姓名为必填项',
            },
          ]}
          label="姓名"
          name="name"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '手机号为必填项',
            },
            {
              pattern: /^1[3-9]\d{9}$/,
              message: '请输入正确的手机号格式',
            },
          ]}
          label="手机号"
          name="mobile"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '密码为必填项',
            },
          ]}
          label="密码"
          name="password"
          fieldProps={{
            type: 'password',
          }}
        />
        <ProFormText
          label="工号"
          name="workNumber"
        />
        <ProFormText
          label="岗位"
          name="post"
        />
        <ProFormText
          label="部门名称"
          name="dcDepartmentName"
        />
        <ProFormText
          label="车间名称"
          name="dcProductLineName"
        />
        <ProFormSelect
          name="roleList"
          label="分配角色"
          mode="multiple"
          options={roleOptions}
          placeholder="请选择角色"
        />
      </ModalForm>
      
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.updateForm.accountConfig',
          defaultMessage: '编辑账户',
        })}
        width="400px"
        open={updateModalOpen}
        onOpenChange={handleUpdateModalOpen}
        initialValues={currentRow}
        onFinish={async (value) => {
          try {
            await updateAccount({
              ...value,
              id: currentRow?.id,
            } as API.AccountSaveParam);
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            message.success('更新成功');
            if (actionRef.current) {
              actionRef.current.reload();
            }
            return true;
          } catch (error) {
            message.error('更新失败');
            return false;
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '姓名为必填项',
            },
          ]}
          label="姓名"
          name="name"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '手机号为必填项',
            },
            {
              pattern: /^1[3-9]\d{9}$/,
              message: '请输入正确的手机号格式',
            },
          ]}
          label="手机号"
          name="mobile"
        />
        <ProFormText
          label="密码"
          name="password"
          fieldProps={{
            type: 'password',
          }}
          placeholder="不修改请留空"
        />
        <ProFormText
          label="工号"
          name="workNumber"
        />
        <ProFormText
          label="岗位"
          name="post"
        />
        <ProFormText
          label="部门名称"
          name="dcDepartmentName"
        />
        <ProFormText
          label="车间名称"
          name="dcProductLineName"
        />
        <ProFormSelect
          name="roleList"
          label="分配角色"
          mode="multiple"
          options={roleOptions}
          placeholder="请选择角色"
        />
      </ModalForm>
      
      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <div>
            <h3>账户详情</h3>
            <p><strong>姓名:</strong> {currentRow.name}</p>
            <p><strong>手机号:</strong> {currentRow.mobile}</p>
            <p><strong>工号:</strong> {currentRow.workNumber}</p>
            <p><strong>岗位:</strong> {currentRow.post}</p>
            <p><strong>部门:</strong> {currentRow.dcDepartmentName}</p>
            <p><strong>车间:</strong> {currentRow.dcProductLineName}</p>
            <p><strong>创建时间:</strong> {currentRow.createTime}</p>
            <p><strong>更新时间:</strong> {currentRow.updateTime}</p>
            <p><strong>状态:</strong> {currentRow.del === 0 ? '启用' : '禁用'}</p>
            <div>
              <strong>分配角色:</strong>
              <div style={{ marginTop: 8 }}>
                {currentRow.authVOList && currentRow.authVOList.length > 0 ? (
                  currentRow.authVOList.map((role: any, index: number) => (
                    <Tag color="blue" key={index} style={{ marginBottom: 4 }}>
                      {role.roleName}
                    </Tag>
                  ))
                ) : (
                  <Tag color="default">暂无角色</Tag>
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default AccountList;