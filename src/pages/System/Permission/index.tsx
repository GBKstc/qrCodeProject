import { PlusOutlined } from '@ant-design/icons';
import {
  PageContainer,
} from '@ant-design/pro-components';
import { Button, Tree, Card, Space, Checkbox, message, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import type { DataNode } from 'antd/es/tree';
import { history, useLocation } from 'umi';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { 
  getAllPermissions, 
  saveOrUpdatePermission,
  getRoleDetail,
  type PermissionItem, 
  type PermissionSaveParam,
  type RoleDetailResult 
} from '@/services/system/permission';

const PermissionManagement: React.FC = () => {
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const location = useLocation();
  
  // 获取URL参数
  const query = new URLSearchParams(location.search);
  const roleId = query.get('roleId');
  const roleName = query.get('roleName');
  const from = query.get('from');
  
  // 判断是否来自角色管理页面
  const isFromRole = from === 'role' && roleId;

  // 将权限数据转换为树形结构（根据level层级）
  const convertToTreeData = (permissions: PermissionItem[]): DataNode[] => {
    // 按level分组
    const level1Items = permissions.filter(item => item.level === 1);
    const level2Items = permissions.filter(item => item.level === 2);
    const level3Items = permissions.filter(item => item.level === 3);

    // 构建树形结构
    const buildTree = (): DataNode[] => {
      return level1Items.map(level1 => {
        // 找到属于当前level1的level2项目
        const children2 = level2Items
          .filter(level2 => level2.code.startsWith(level1.code) && level2.code !== level1.code)
          .map(level2 => {
            // 找到属于当前level2的level3项目
            const children3 = level3Items
              .filter(level3 => level3.code.startsWith(level2.code) && level3.code !== level2.code)
              .map(level3 => ({
                title: level3.name,
                key: level3.code,
                isLeaf: true,
              }));

            return {
              title: level2.name,
              key: level2.code,
              children: children3.length > 0 ? children3 : undefined,
            };
          });

        return {
          title: level1.name,
          key: level1.code,
          children: children2.length > 0 ? children2 : undefined,
        };
      });
    };

    return buildTree();
  };

  // 获取权限数据
  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const response = await getAllPermissions();
      if (response.success && response.data?.records) {
        const treeNodes = convertToTreeData(response.data.records);
        setTreeData(treeNodes);
        console.log('权限数据:', response.data.records);
        console.log('转换后的树形数据:', treeNodes);
      } else {
        message.error('获取权限数据失败');
      }
    } catch (error) {
      console.error('获取权限数据失败:', error);
      message.error('获取权限数据失败');
    } finally {
      setLoading(false);
    }
  };

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

  // 获取角色权限数据
  const fetchRolePermissions = async (roleId: string) => {
    try {
      const response = await getRoleDetail(parseInt(roleId));
      if (response.success && response.data?.authVOList) {
        // 从角色详情中提取已有的权限menuId
        const existingPermissions = response.data.authVOList.map(auth => auth.menuId.toString());
        setCheckedKeys(existingPermissions);
        console.log('角色已有权限:', existingPermissions);
      } else {
        console.warn('获取角色权限失败:', response.message);
      }
    } catch (error) {
      console.error('获取角色权限失败:', error);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchPermissions();
  }, []);

  // 获取角色权限数据（替换原来的模拟数据）
  useEffect(() => {
    if (isFromRole && roleId && treeData.length > 0) {
      fetchRolePermissions(roleId);
    }
  }, [roleId, isFromRole, treeData]);

  const allKeys = getAllKeys(treeData);

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
        // 构建权限保存参数
        const authSaveParamList = checkedKeys.map(menuCode => {
          // 如果menuCode是数字字符串，直接使用；否则尝试从权限数据中找到对应的id
          const menuId = /^\d+$/.test(menuCode.toString()) 
            ? parseInt(menuCode.toString()) 
            : 0; // 如果无法转换，使用0作为默认值
          
          return {
            menuId,
            roleId: parseInt(roleId) || 0
          };
        });

        const saveParams: PermissionSaveParam = {
          authSaveParamList,
          companyId: 0,
          del: 0,
          id: parseInt(roleId) || 0,
          roleCode: roleId || '',
          roleName: roleName || ''
        };

        console.log('保存权限参数:', saveParams);
        
        const response = await saveOrUpdatePermission(saveParams);
        
        if (response.success) {
          console.log(`保存角色 ${roleName}(${roleId}) 的权限成功:`, checkedKeys);
          message.success(`角色 ${roleName} 权限设置成功`);
          
          // 立即返回角色管理页面
          history.push('/system/role');
        } else {
          message.error(response.message || '保存失败');
        }
      } else {
        // 系统权限配置保存（如果需要的话）
        message.success('权限配置保存成功');
      }
    } catch (error) {
      console.error('保存权限失败:', error);
      message.error('保存失败，请重试');
    }
  };

  // 返回角色管理页面
  const handleBack = () => {
    history.push('/system/role');
  };

  // 重置权限（更新为从API获取）
  const handleReset = async () => {
    if (isFromRole && roleId) {
      await fetchRolePermissions(roleId);
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
            <Button 
              type="link" 
              onClick={fetchPermissions}
              loading={loading}
            >
              刷新数据
            </Button>
          </Space>
        }
      >
        <Spin spinning={loading}>
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
        </Spin>
      </Card>
    </PageContainer>
  );
};

export default PermissionManagement;