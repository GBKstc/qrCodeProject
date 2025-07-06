import { request } from '@umijs/max';

/** 获取设备列表 */
export async function getEquipmentList(
  params: {
    /** 页码,默认1 */
    currPage?: number;
    /** 名称 */
    name?: string;
    /** 操作人 */
    operateId?: number;
    /** 操作人名称 */
    operateName?: string;
    /** 数量,默认10 */
    pageSize?: number;
    /** 工序id */
    productionProcessesId?: number;
    /** 备注 */
    remark?: string;
    /** 序号 */
    sort?: number;
    /** 设备类型 1喷码机 */
    type?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.EquipmentListResult>('/api/daciDevice/pageList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新增或更新设备 */
export async function saveOrUpdateEquipment(
  data: API.EquipmentApiItem,
  options?: { [key: string]: any },
) {
  return request<API.CommonResponse>('/api/daciDevice/saveOrUpdate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...(options || {}),
  });
}

/** 删除设备 */
export async function removeEquipment(
  id: number,
  options?: { [key: string]: any },
) {
  return request<API.CommonResponse>('/api/daciDevice/saveOrUpdate', {
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