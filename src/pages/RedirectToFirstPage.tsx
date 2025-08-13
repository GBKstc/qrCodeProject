import { useEffect, useState } from 'react';
import { history, useAccess, useModel } from '@umijs/max';
import { Spin } from 'antd';

const RedirectToFirstPage: React.FC = () => {
  const access = useAccess();
  const { initialState } = useModel('@@initialState');
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // 重置检查状态
    setHasChecked(false);
  }, [initialState]);

  useEffect(() => {
    if (hasChecked) return;
    
    console.log('当前权限状态:', access);
    
    // 检查用户是否已登录
    const userInfo = localStorage.getItem('userInfo');
    
    if (!userInfo) {
      // 用户未登录，直接跳转到登录页面
      history.replace('/user/login');
      return;
    }

    // 定义所有可能的页面路径和对应的权限检查
    const pageRoutes = [
      { path: '/system/role', permission: 'canViewRole' },
      { path: '/system/account', permission: 'canViewAccount' },
      { path: '/production/process', permission: 'canViewProcess' },
      { path: '/production/equipment', permission: 'canViewEquipment' },
      { path: '/production/equipment-overview', permission: 'canViewEquipment' },
      { path: '/production/qrcode', permission: 'canViewQRCode' },
      { path: '/production/product', permission: 'canViewProduct' },
      { path: '/production/info', permission: 'canViewProductionInfo' },
      { path: '/production/infowb', permission: 'canViewProductionInfowb' },
      { path: '/production/display', permission: 'canViewDisplay' },
    ];

    // 查找第一个有权限的页面
    const firstAccessiblePage = pageRoutes.find(route => 
      access[route.permission as keyof typeof access]
    );

    if (firstAccessiblePage) {
      // 跳转到第一个有权限的页面
      history.replace(firstAccessiblePage.path);
    }
    
    setHasChecked(true);
  }, [access, hasChecked]);

  // 显示加载状态
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      {/* <Spin size="large" /> */}
    </div>
  );
};

export default RedirectToFirstPage;