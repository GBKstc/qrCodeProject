import { request } from '@umijs/max';

/** 角色管理分页查询 GET /api/dcPlatRole/pageList */
export async function getRoleList(
  params: API.RolePageParams,
  options?: { [key: string]: any },
) {
  return request<API.RoleListResult>('/api/dcPlatRole/pageList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取大量角色列表（分页接口获取999条） GET /api/dcPlatRole/pageList */
export async function getAllRolesWithPagination(options?: { [key: string]: any }) {
  return request<API.RoleListResult>('/api/dcPlatRole/pageList', {
    method: 'GET',
    params: {
      currPage: 1,
      pageSize: 999,
      status:0
    },
    ...(options || {}),
  });
}

/** 新增角色 POST /api/dcPlatRole/saveOrUpdate */
export async function addRole(body: API.RoleSaveParam, options?: { [key: string]: any }) {
  return request<API.SystemCommonResponse>('/api/dcPlatRole/saveOrUpdate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新角色 POST /api/dcPlatRole/saveOrUpdate */
export async function updateRole(body: API.RoleSaveParam, options?: { [key: string]: any }) {
  return request<API.SystemCommonResponse>('/api/dcPlatRole/saveOrUpdate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除角色 DELETE /api/dcPlatRole/{id} */
export async function removeRole(id: number, options?: { [key: string]: any }) {
  return request<API.SystemCommonResponse>(`/api/dcPlatRole/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 获取角色详情 GET /api/dcPlatRole/{id} */
export async function getRoleDetail(id: number, options?: { [key: string]: any }) {
  return request<API.RoleItem>(`/api/dcPlatRole/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 批量删除角色 DELETE /api/dcPlatRole/batch */
export async function batchRemoveRole(ids: number[], options?: { [key: string]: any }) {
  return request<API.SystemCommonResponse>('/api/dcPlatRole/batch', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { ids },
    ...(options || {}),
  });
}

/** 获取所有角色列表（不分页） GET /api/dcPlatRole/all */
export async function getAllRoles(options?: { [key: string]: any }) {
  return request<API.RoleItem[]>('/api/dcPlatRole/all', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 禁用/启用角色 GET /api/dcPlatRole/disable */
export async function disableRole(id: any, options?: { [key: string]: any }) {
  return request<API.SystemCommonResponse>('/api/dcPlatRole/disable', {
    method: 'GET',
    params: { id },
    ...(options || {}),
  });
}