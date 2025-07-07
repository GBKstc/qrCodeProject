import { request } from 'umi';

// 权限项类型定义（根据实际API返回数据结构）
export type PermissionItem = {
  id: number;
  name: string;
  code: string;
  level: number;
  button: number;
  operatorId?: number;
  operatorName?: string;
  remark?: string;
  createTime: string;
  updateTime?: string;
};

// 权限保存参数（根据接口规范）
export type AuthSaveParam = {
  menuId: number;
  roleId: number;
};

export type PermissionSaveParam = {
  authSaveParamList: AuthSaveParam[];
  companyId: number;
  del: number;
  id: number;
  roleCode: string;
  roleName: string;
};

// 权限分页查询参数（更新为新的参数结构）
export type PermissionPageParams = {
  currPage?: number;        // 页码,默认1
  pageSize?: number;        // 数量,默认10
  button?: number;          // 是否是按钮（0-否 1-是)
  code?: string;            // 编码
  level?: number;           // 级别
  name?: string;            // 名称
  operatorId?: number;      // 操作人ID
  operatorName?: string;    // 操作人姓名
  remark?: string;          // 备注
};

// 权限分页查询结果
export type PermissionListResult = {
  records: PermissionItem[];
  total: number;
  size: number;
  current: number;
  orders: any[];
  optimizeCountSql: boolean;
  searchCount: boolean;
  countId?: string;
  maxLimit?: number;
  pages: number;
};

// 获取权限列表（分页）- 更新接口地址
export async function getPermissionList(params: PermissionPageParams) {
  return request<{
    success: boolean;
    message: string;
    reason?: any;
    code: string;
    data: PermissionListResult;
  }>('/api/dcPlatMenu/pageList', {
    method: 'GET',
    params,
  });
}

// 获取所有权限（一次性获取999条）
export async function getAllPermissions() {
  return getPermissionList({
    currPage: 1,
    pageSize: 999,
  });
}

// 根据级别获取权限
export async function getPermissionsByLevel(level: number) {
  return getPermissionList({
    currPage: 1,
    pageSize: 999,
    level,
  });
}

// 根据是否为按钮获取权限
export async function getPermissionsByButton(button: number) {
  return getPermissionList({
    currPage: 1,
    pageSize: 999,
    button,
  });
}

// 根据编码搜索权限
export async function searchPermissionsByCode(code: string) {
  return getPermissionList({
    currPage: 1,
    pageSize: 999,
    code,
  });
}

// 根据名称搜索权限
export async function searchPermissionsByName(name: string) {
  return getPermissionList({
    currPage: 1,
    pageSize: 999,
    name,
  });
}

// 权限保存或更新接口
export async function saveOrUpdatePermission(params: PermissionSaveParam) {
  return request<{
    success: boolean;
    message: string;
    reason?: {
      errMsg: string;
      exFrom: string;
    };
    code: string;
    data: any;
  }>('/api/dcPlatRole/saveOrUpdate', {
    method: 'POST',
    data: params,
  });
}


// 角色权限详情类型定义
export type AuthVO = {
  createTime: string;
  id: number;
  menuId: number;
  menuName: string;
  operatorId: number;
  operatorName: string;
  remark: string;
  roleId: number;
  roleTemplateId: number;
  updateTime: string;
};

export type RoleDetailResult = {
  authVOList: AuthVO[];
  companyId: number;
  createTime: string;
  id: number;
  operatorId: number;
  operatorName: string;
  remark: string;
  roleCode: string;
  roleName: string;
  updateTime: string;
};

// 获取角色详情接口
export async function getRoleDetail(id: number) {
  return request<{
    success: boolean;
    message: string;
    reason?: {
      errMsg: string;
      exFrom: string;
    };
    code: string;
    data: RoleDetailResult;
  }>('/api/dcPlatRole/detail', {
    method: 'GET',
    params: { id },
  });
}