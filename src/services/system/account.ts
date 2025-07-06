import { request } from '@umijs/max';

/** 账户管理分页查询 GET /api/dcPlatUser/pageList */
export async function getAccountList(
  params: API.AccountPageParams,
  options?: { [key: string]: any },
) {
  return request<API.AccountListResult>('/api/dcPlatUser/pageList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新增账户 POST /api/dcPlatUser/saveOrUpdate */
export async function addAccount(body: API.AccountSaveParam, options?: { [key: string]: any }) {
  return request<API.SystemCommonResponse>('/api/dcPlatUser/saveOrUpdate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新账户 POST /api/dcPlatUser/saveOrUpdate */
export async function updateAccount(body: API.AccountSaveParam, options?: { [key: string]: any }) {
  return request<API.SystemCommonResponse>('/api/dcPlatUser/saveOrUpdate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除账户 DELETE /api/dcPlatUser/{id} */
export async function removeAccount(id: number, options?: { [key: string]: any }) {
  return request<API.SystemCommonResponse>(`/api/dcPlatUser/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 获取账户详情 GET /api/dcPlatUser/{id} */
export async function getAccountDetail(id: number, options?: { [key: string]: any }) {
  return request<API.AccountItem>(`/api/dcPlatUser/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 批量删除账户 DELETE /api/dcPlatUser/batch */
export async function batchRemoveAccount(ids: number[], options?: { [key: string]: any }) {
  return request<API.SystemCommonResponse>('/api/dcPlatUser/batch', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { ids },
    ...(options || {}),
  });
}