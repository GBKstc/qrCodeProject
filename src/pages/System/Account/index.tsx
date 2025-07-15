import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, message, Switch, Tag, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import { getAccountList, addAccount, updateAccount, disableAccount } from '@/services/system/account';
import { getAllRolesWithPagination } from '@/services/system/role';

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
      const response = await getAllRolesWithPagination();
      if (response.success && response.data && response.data.records) {
        const options = response.data.records.map((role: API.RoleItem) => ({
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
      title: '账号',
      dataIndex: 'mobile',
      // tip: '账户手机号',
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
      title: '成员姓名',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
      title: '授予权限（角色）',
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
      title: '备注信息',
      dataIndex: 'remark',
      valueType: 'text',
      hideInSearch: true,
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
              await disableAccount(record.id);
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
        <Popconfirm
          title="确认删除"
          description="确定要删除这个账户吗？此操作不可恢复。"
          onConfirm={async () => {
            try {
              await disableAccount(record.id!);
              message.success('禁用成功');
              actionRef.current?.reload();
            } catch (error) {
              message.error('禁用失败');
            }
          }}
          okText="确认"
          cancelText="取消"
        >
          <a key="delete">
            <FormattedMessage id="pages.searchTable.delete" defaultMessage="删除" />
          </a>
        </Popconfirm>,
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
              } else if (sortKey === 'updateTime') {
                sortType = 2; // 2表示登录时间排序
                sortOrder = sortValue === 'ascend' ? 'asc' : 'desc';
              }
            }
            
            const response = await getAccountList({
              ...params,
              currPage: params.current,
              pageSize: params.pageSize,
              sortType: sortType,
              sortOrder: sortOrder,
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
                // 批量禁用：逐个调用disableAccount接口
                const disablePromises = selectedRowsState.map((row) => 
                  disableAccount(row.id!)
                );
                await Promise.all(disablePromises);
                setSelectedRows([]);
                actionRef.current?.reloadAndRest?.();
                message.success('批量禁用成功');
              } catch (error) {
                message.error('批量禁用失败');
              }
            }}
          >
            <FormattedMessage id="pages.searchTable.batchDeletion" defaultMessage="批量删除" />
          </Button>
        </div>
      )}
      
      {/* 新建账户表单 */}
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
            // 设置默认启用状态
            const accountData = {
              ...value,
              del: value.status ? 0 : 1, // true对应启用(0)，false对应禁用(1)
            };
            delete accountData.status; // 移除前端字段，使用del字段
            await addAccount(accountData as API.AccountSaveParam);
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
              message: '账号为必填项',
            },
            {
              pattern: /^1[3-9]\d{9}$/,
              message: '请输入正确的手机号格式',
            },
          ]}
          label="账号"
          name="mobile"
          placeholder="请输入手机号作为账号"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '成员姓名为必填项',
            },
          ]}
          label="成员姓名"
          name="name"
          placeholder="请输入成员姓名"
        />
        <ProFormSelect
          rules={[
            {
              required: true,
              message: '授予权限为必填项',
            },
          ]}
          name="roleList"
          label="授予权限(角色)"
          // mode="multiple"
          options={roleOptions}
          placeholder="请选择角色"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '登录密码为必填项',
            },
            {
              min: 6,
              message: '密码长度不能少于6位',
            },
          ]}
          label="登录密码"
          name="password"
          fieldProps={{
            type: 'password',
          }}
          placeholder="请输入登录密码"
        />
        <ProFormTextArea
          label="备注信息"
          name="remark"
          placeholder="请输入备注信息（可选）"
          fieldProps={{
            rows: 3,
          }}
        />
        {/* <ProFormSwitch
          label="是否启用"
          name="status"
          initialValue={true}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        /> */}
      </ModalForm>
      
      {/* 编辑账户表单 */}
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.updateForm.accountConfig',
          defaultMessage: '编辑账户',
        })}
        width="400px"
        open={updateModalOpen}
        onOpenChange={handleUpdateModalOpen}
        initialValues={{
          ...currentRow,
          password: undefined,
          roleList: currentRow?.authVOList?.map((role: any) => role.roleId || role.id) || [],
          status: currentRow?.del === 0, // 将del字段转换为布尔值
        }}
        key={currentRow?.id}
        onFinish={async (value) => {
          try {
            const updateParams: any = {
              ...value,
              id: currentRow?.id,
              del: value.status ? 0 : 1, // true对应启用(0)，false对应禁用(1)
            };
            
            delete updateParams.status; // 移除前端字段，使用del字段
            
            if (!value.password || value.password.trim() === '') {
              delete updateParams.password;
            }
            
            await updateAccount(updateParams as API.AccountSaveParam);
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
        {/* 编辑账户表单中的账号字段 */}
        <ProFormText
          rules={[
            {
              required: true,
              message: '账号为必填项',
            },
            {
              pattern: /^1[3-9]\d{9}$/,
              message: '请输入正确的手机号格式',
            },
            {
              max: 20,
              message: '账号长度不能超过20个字符',
            },
          ]}
          label="账号"
          name="mobile"
          placeholder="请输入手机号作为账号"
        />
        
        {/* 编辑账户表单中的成员姓名字段 */}
        <ProFormText
          rules={[
            {
              required: true,
              message: '成员姓名为必填项',
            },
            {
              max: 20,
              message: '成员姓名长度不能超过20个字符',
            },
          ]}
          label="成员姓名"
          name="name"
          placeholder="请输入成员姓名"
        />
        <ProFormSelect
          rules={[
            {
              required: true,
              message: '授予权限为必填项',
            },
          ]}
          name="roleList"
          label="授予权限(角色)"
          // mode="multiple"
          options={roleOptions}
          placeholder="请选择角色"
        />
        <ProFormText
          label="登录密码"
          name="password"
          fieldProps={{
            type: 'password',
            autoComplete: 'new-password', // 防止浏览器自动填充
          }}
          placeholder="不修改请留空"
        />
        <ProFormTextArea
          label="备注信息"
          name="remark"
          placeholder="请输入备注信息（可选）"
          fieldProps={{
            rows: 3,
          }}
        />
        {/* <ProFormSwitch
          label="是否启用"
          name="status"
          checkedChildren="启用"
          unCheckedChildren="禁用"
        /> */}
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
