import { request } from '@umijs/max';

/** 获取展示信息列表 */
export async function getDisplayList(
  params: {
    /** 字段编号 */
    code?: string;
    /** 页码,默认1 */
    currPage?: number;
    /** 是否展示 0不展示 1展示 */
    isShow?: number;
    /** 名称 */
    name?: string;
    /** 操作人 */
    operateId?: number;
    /** 操作人名称 */
    operateName?: string;
    /** 数量,默认10 */
    pageSize?: number;
    /** 备注 */
    remark?: string;
  },
  options?: { [key: string]: any },
) {
  return request<any>('/api/daciProduceShow/pageList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新增或更新展示信息 */
export async function saveOrUpdateDisplay(
  data: any,
  options?: { [key: string]: any },
) {
  return request<any>('/api/daciProduceShow/saveOrUpdate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...(options || {}),
  });
}

/** 删除展示信息 */
export async function removeDisplay(
  id: number,
  options?: { [key: string]: any },
) {
  return request<any>('/api/daciProduceShow/saveOrUpdate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id,
      del: 1,
    },
    ...(options || {}),
  });
}