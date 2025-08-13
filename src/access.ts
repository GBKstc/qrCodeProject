/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: any) {
  // 优先从 initialState 获取用户信息，如果没有则从 localStorage 获取
  let currentUser = initialState?.currentUser || initialState?.userInfo;
  
  if (!currentUser) {
    const userInfo = localStorage.getItem('userInfo');
    try {
      currentUser = userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('解析用户信息失败:', error);
    }
  }
  
  // 获取用户权限列表
  const userPermissions = currentUser?.authList || [];
  
  // 检查用户是否有特定权限（根据 code 字段）
  const hasPermission = (permissionCode: string) => {
    return userPermissions.some((auth: any) => auth.code === permissionCode);
  };
  
  // 检查用户是否有模块权限（支持父级权限检查）
  const hasModulePermission = (moduleCode: string) => {
    return userPermissions.some((auth: any) => 
      auth.code === moduleCode || auth.code.startsWith(moduleCode)
    );
  };
 
  return {
    // 系统管理权限 (100)
    canAdmin: hasModulePermission('100'),
    canViewRole: hasPermission('100100'),
    canEditRole: hasPermission('100100101'),
    canAddRole: hasPermission('100100102'),
    canDeleteRole: hasPermission('100100103'),
    canViewPermission: hasPermission('100100'),
    canViewAccount: hasPermission('100200'),
    canEditAccount: hasPermission('100200101'),
    canAddAccount: hasPermission('100200102'),
    canDeleteAccount: hasPermission('100200103'),
    
    // 生产管理权限 (200)
    canProduction: hasModulePermission('200'),
    canViewProcess: hasPermission('200100'),
    canAddProcess: hasPermission('200100100'),
    canEditProcess: hasPermission('200100101'),
    canViewEquipment: hasPermission('200200'),
    canAddEquipment: hasPermission('200200100'),
    canEditEquipment: hasPermission('200200101'),
    canDeleteEquipment: hasPermission('200200102'),
    canViewQRCode: hasPermission('200300'),
    canAddQRCode: hasPermission('200300100'),
    canExportQRCode: hasPermission('200300101'),
    canDeleteQRCode: hasPermission('200300102'),
    canViewProduct: hasPermission('200400'),
    canAddProduct: hasPermission('200400100'),
    canEditProduct: hasPermission('200400101'),
    canDeleteProduct: hasPermission('200400102'),
    canViewProductionInfo: hasPermission('200500'),
    canViewProductionDetail: hasPermission('200500100'),
    canViewDisplay: hasPermission('200600'),
    canEditDisplay: hasPermission('200600101'),
    canDeleteDisplay: hasPermission('200600102'),
    canViewProductionInfowb: hasPermission('200700'),
  };
}
