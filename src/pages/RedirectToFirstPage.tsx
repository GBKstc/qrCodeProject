import { useEffect } from 'react';
import { history, useAccess } from '@umijs/max';
import { Spin } from 'antd';

const RedirectToFirstPage: React.FC = () => {
  const access = useAccess();

  useEffect(() => {
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
    } else {
      // 如果没有任何权限，跳转到欢迎页面而不是404
      // 避免从404页面点击返回首页后又回到404的循环
      history.replace('/welcome');
    }
  }, [access]);

  // 显示加载状态
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <Spin size="large" />
    </div>
  );
};

export default RedirectToFirstPage;