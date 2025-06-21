import { PlusOutlined } from '@ant-design/icons';
import {
  PageContainer,
} from '@ant-design/pro-components';
import { Button, Tree, Card, Space, Checkbox, message } from 'antd';
import React, { useState, useEffect } from 'react';
import type { DataNode } from 'antd/es/tree';
import { history, useLocation } from 'umi';
import { ArrowLeftOutlined } from '@ant-design/icons';

const PermissionManagement: React.FC = () => {
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const location = useLocation();
  
  // 获取URL参数
  const query = new URLSearchParams(location.search);
  const roleId = query.get('roleId');
  const roleName = query.get('roleName');
  const from = query.get('from');
  
  // 判断是否来自角色管理页面
  const isFromRole = from === 'role' && roleId;
  // 根据路由配置构建完整的权限树数据
  const treeData: DataNode[] = [
    {
      title: '欢迎页',
      key: 'welcome',
      children: [
        { title: '查看欢迎页', key: 'welcome:view' },
      ],
    },
    {
      title: '系统管理',
      key: 'system',
      children: [
        {
          title: '角色管理',
          key: 'system:role',
          children: [
            { title: '查看角色列表', key: 'system:role:view' },
            { title: '创建角色', key: 'system:role:create' },
            { title: '编辑角色', key: 'system:role:edit' },
            { title: '删除角色', key: 'system:role:delete' },
            { title: '设置角色权限', key: 'system:role:permission' },
            { title: '启用/禁用角色', key: 'system:role:status' },
          ],
        },
        {
          title: '权限管理',
          key: 'system:permission',
          children: [
            { title: '查看权限树', key: 'system:permission:view' },
            { title: '创建权限', key: 'system:permission:create' },
            { title: '编辑权限', key: 'system:permission:edit' },
            { title: '删除权限', key: 'system:permission:delete' },
          ],
        },
        {
          title: '账号管理',
          key: 'system:account',
          children: [
            { title: '查看账号列表', key: 'system:account:view' },
            { title: '创建账号', key: 'system:account:create' },
            { title: '编辑账号', key: 'system:account:edit' },
            { title: '删除账号', key: 'system:account:delete' },
            { title: '重置密码', key: 'system:account:reset' },
            { title: '分配角色', key: 'system:account:role' },
          ],
        },
      ],
    },
    {
      title: '生产管理',
      key: 'production',
      children: [
        {
          title: '工序管理',
          key: 'production:process',
          children: [
            { title: '查看工序列表', key: 'production:process:view' },
            { title: '添加工序', key: 'production:process:create' },
            { title: '编辑工序', key: 'production:process:edit' },
            { title: '删除工序', key: 'production:process:delete' },
            { title: '工序排序', key: 'production:process:sort' },
          ],
        },
        {
          title: '设备管理',
          key: 'production:equipment',
          children: [
            { title: '查看设备列表', key: 'production:equipment:view' },
            { title: '添加设备', key: 'production:equipment:create' },
            { title: '编辑设备', key: 'production:equipment:edit' },
            { title: '删除设备', key: 'production:equipment:delete' },
            { title: '设备维护', key: 'production:equipment:maintain' },
          ],
        },
        {
          title: '设备状态概览',
          key: 'production:equipment:overview',
          children: [
            { title: '查看设备状态', key: 'production:equipment:overview:view' },
            { title: '设备状态统计', key: 'production:equipment:overview:stats' },
            { title: '设备报警处理', key: 'production:equipment:overview:alarm' },
          ],
        },
        {
          title: '二维码管理',
          key: 'production:qrcode',
          children: [
            { title: '查看二维码列表', key: 'production:qrcode:view' },
            { title: '新增二维码', key: 'production:qrcode:create' },
            { title: '生成二维码', key: 'production:qrcode:generate' },
            { title: '导出二维码', key: 'production:qrcode:export' },
            { title: '删除二维码', key: 'production:qrcode:delete' },
            { title: '二维码批量操作', key: 'production:qrcode:batch' },
          ],
        },
        {
          title: '产品管理',
          key: 'production:product',
          children: [
            { title: '查看产品列表', key: 'production:product:view' },
            { title: '添加产品', key: 'production:product:create' },
            { title: '编辑产品', key: 'production:product:edit' },
            { title: '删除产品', key: 'production:product:delete' },
            { title: '产品分类管理', key: 'production:product:category' },
          ],
        },
        {
          title: '生产信息管理',
          key: 'production:info',
          children: [
            { title: '查看生产信息', key: 'production:info:view' },
            { title: '生产信息详情', key: 'production:info:detail' },
            { title: '编辑生产信息', key: 'production:info:edit' },
            { title: '删除生产信息', key: 'production:info:delete' },
            { title: '生产统计报表', key: 'production:info:report' },
          ],
        },
        {
          title: '展示信息管理',
          key: 'production:display',
          children: [
            { title: '查看展示信息', key: 'production:display:view' },
            { title: '生产信息展示项设定', key: 'production:display:setting' },
            { title: '编辑展示信息', key: 'production:display:edit' },
            { title: '删除展示信息', key: 'production:display:delete' },
            { title: '展示模板管理', key: 'production:display:template' },
          ],
        },
      ],
    },
  ];

  // 获取所有节点的key
  const getAllKeys = (data: DataNode[]): React.Key[] => {
    const keys: React.Key[] = [];
    const traverse = (nodes: DataNode[]) => {
      nodes.forEach(node => {
        keys.push(node.key);
        if (node.children) {
          traverse(node.children);
        }
      });
    };
    traverse(data);
    return keys;
  };

  const allKeys = getAllKeys(treeData);

  // 模拟获取角色权限数据
  useEffect(() => {
    if (isFromRole) {
      // 模拟根据角色ID获取已有权限
      const mockRolePermissions = {
        '1': ['system:role:view', 'system:role:create', 'system:role:edit', 'system:permission:view'],
        '2': ['production:process:view', 'production:equipment:view'],
        '3': ['production:process:view']
      };
      
      const rolePermissions = mockRolePermissions[roleId as keyof typeof mockRolePermissions] || [];
      setCheckedKeys(rolePermissions);
    }
  }, [roleId, isFromRole]);

  // 全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setCheckedKeys(allKeys);
    } else {
      setCheckedKeys([]);
    }
  };

  // 展开/收起所有节点
  const handleExpandAll = (expand: boolean) => {
    if (expand) {
      setExpandedKeys(allKeys);
    } else {
      setExpandedKeys([]);
    }
    setAutoExpandParent(false);
  };

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue: any) => {
    setCheckedKeys(checkedKeysValue);
    console.log('选中的权限:', checkedKeysValue);
  };

  // 保存权限配置
  const handleSave = async () => {
    try {
      if (isFromRole) {
        // 模拟API调用保存角色权限
        const saveRolePermissions = async (roleId: string, permissions: React.Key[]) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              // 模拟保存到localStorage或发送到后端
              const rolePermissionsData = JSON.parse(localStorage.getItem('rolePermissions') || '{}');
              rolePermissionsData[roleId] = permissions;
              localStorage.setItem('rolePermissions', JSON.stringify(rolePermissionsData));
              resolve(true);
            }, 500);
          });
        };
        
        await saveRolePermissions(roleId, checkedKeys);
        console.log(`保存角色 ${roleName}(${roleId}) 的权限:`, checkedKeys);
        message.success(`角色 ${roleName} 权限设置成功`);
        
        // 立即返回角色管理页面
        history.push('/system/role');
      } else {
        // 保存系统权限配置
        const saveSystemPermissions = async (permissions: React.Key[]) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              localStorage.setItem('systemPermissions', JSON.stringify(permissions));
              resolve(true);
            }, 500);
          });
        };
        
        await saveSystemPermissions(checkedKeys);
        console.log('保存系统权限配置:', checkedKeys);
        message.success('权限配置保存成功');
      }
    } catch (error) {
      message.error('保存失败，请重试');
    }
  };

  // 返回角色管理页面
  const handleBack = () => {
    history.push('/system/role');
  };

  // 重置权限
  // 添加更完善的角色权限mock数据
  const mockRolePermissions = {
    '1': {
      roleName: '超级管理员',
      permissions: [
        'welcome:view',
        'system', 'system:role', 'system:role:view', 'system:role:create', 
        'system:role:edit', 'system:role:delete', 'system:role:permission', 'system:role:status',
        'system:permission', 'system:permission:view', 'system:permission:create', 
        'system:permission:edit', 'system:permission:delete',
        'system:account', 'system:account:view', 'system:account:create', 
        'system:account:edit', 'system:account:delete', 'system:account:reset', 'system:account:role',
        'production', 'production:process', 'production:process:view', 'production:process:create',
        'production:equipment', 'production:equipment:view', 'production:qrcode', 'production:qrcode:view'
      ]
    },
    '2': {
      roleName: '生产管理员',
      permissions: [
        'welcome:view',
        'production', 'production:process', 'production:process:view', 'production:process:create',
        'production:equipment', 'production:equipment:view', 'production:equipment:create',
        'production:qrcode', 'production:qrcode:view', 'production:qrcode:create',
        'production:product', 'production:product:view', 'production:product:create'
      ]
    },
    '3': {
      roleName: '普通用户',
      permissions: [
        'welcome:view',
        'production:process:view', 
        'production:equipment:view',
        'production:product:view'
      ]
    }
  };
  
  // 重置权限时使用mock数据
  const handleReset = () => {
    if (isFromRole) {
      const roleData = mockRolePermissions[roleId as keyof typeof mockRolePermissions];
      const rolePermissions = roleData?.permissions || [];
      setCheckedKeys(rolePermissions);
    } else {
      setCheckedKeys([]);
    }
  };

  // 判断是否全选
  const isAllSelected = checkedKeys.length === allKeys.length;
  const isIndeterminate = checkedKeys.length > 0 && checkedKeys.length < allKeys.length;

  return (
    <PageContainer>
      <Card 
        title={
          <Space>
            {isFromRole && (
              <Button 
                type="text" 
                icon={<ArrowLeftOutlined />} 
                onClick={handleBack}
              >
                返回角色管理
              </Button>
            )}
            <span>
              {isFromRole ? `角色权限设置 - ${roleName}` : '权限管理'}
            </span>
          </Space>
        }
        extra={
          <Space>
            <Button 
              type="link" 
              onClick={() => handleExpandAll(true)}
            >
              展开全部
            </Button>
            <Button 
              type="link" 
              onClick={() => handleExpandAll(false)}
            >
              收起全部
            </Button>
          </Space>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Checkbox
              indeterminate={isIndeterminate}
              checked={isAllSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
            >
              全选
            </Checkbox>
            <span style={{ color: '#666' }}>
              已选择 {checkedKeys.length} / {allKeys.length} 项权限
            </span>
          </Space>
        </div>
        
        <Tree
          checkable
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          treeData={treeData}
          style={{
            background: '#fafafa',
            padding: '16px',
            borderRadius: '6px',
            border: '1px solid #d9d9d9'
          }}
        />
        
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Space>
            <Button 
              type="primary" 
              size="large"
              onClick={handleSave}
            >
              {isFromRole ? '保存并返回' : '保存权限配置'}
            </Button>
            <Button 
              size="large"
              onClick={handleReset}
            >
              重置
            </Button>
            {isFromRole && (
              <Button 
                size="large"
                onClick={handleBack}
              >
                取消
              </Button>
            )}
          </Space>
        </div>
      </Card>
    </PageContainer>
  );
};

export default PermissionManagement;