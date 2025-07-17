/**
 * 权限工具函数
 */

// 获取当前用户权限列表
export const getUserPermissions = (): any[] => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      return user.authList || [];
    }
  } catch (error) {
    console.error('获取用户权限失败:', error);
  }
  return [];
};

// 检查是否有指定权限
export const hasPermission = (permissionCode: string): boolean => {
  const permissions = getUserPermissions();
  return permissions.some((auth: any) => auth.code === permissionCode);
};

// 检查是否有模块权限（包括子权限）
export const hasModulePermission = (moduleCode: string): boolean => {
  const permissions = getUserPermissions();
  return permissions.some((auth: any) => 
    auth.code === moduleCode || auth.code.startsWith(moduleCode)
  );
};

// 获取用户信息
export const getCurrentUser = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
};

// 清除用户信息（登出时使用）
export const clearUserInfo = () => {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('userName');
  localStorage.removeItem('userId');
  localStorage.removeItem('userPermissions');
  localStorage.removeItem('token');
  localStorage.removeItem('loginType');
};