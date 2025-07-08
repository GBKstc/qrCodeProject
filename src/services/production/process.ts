import { request } from 'umi';

/** 工序管理分页查询 GET /api/daciProductionProcesses/pageList */
export async function getProcessList(
  params: {
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
    /** 工序名称 */
    name?: string;
    /** 工序描述 */
    description?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.ProcessListResult>('/api/daciProductionProcesses/pageList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新增工序 POST /api/daciProductionProcesses/saveOrUpdate */
export async function addProcess(body: API.ProcessItem, options?: { [key: string]: any }) {
  return request<API.ProcessItem>('/api/daciProductionProcesses/saveOrUpdate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      name: body.name,
      descript: body.description, // 注意：接口字段是 descript
      sort: body.sequence, // 注意：接口字段是 sort
      operateId: 0, // 默认值
      operateName: '', // 默认值
      remark: '', // 默认值
    },
    ...(options || {}),
  });
}

/** 更新工序 POST /api/daciProductionProcesses/saveOrUpdate */
export async function updateProcess(body: API.ProcessItem, options?: { [key: string]: any }) {
  return request<API.ProcessItem>('/api/daciProductionProcesses/saveOrUpdate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: body.id,
      name: body.name,
      descript: body.description, // 注意：接口字段是 descript
      sort: body.sequence, // 注意：接口字段是 sort
      operateId: 0, // 默认值
      operateName: '', // 默认值
      remark: '', // 默认值
    },
    ...(options || {}),
  });
}

/** 删除工序 POST /api/daciProductionProcesses/saveOrUpdate */
export async function removeProcess(id: string | number, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/daciProductionProcesses/saveOrUpdate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: id,
      del: 1, // 删除标识
    },
    ...(options || {}),
  });
}

/** 获取工序详情 GET /api/daciProductionProcesses/{id} */
export async function getProcessDetail(id: string, options?: { [key: string]: any }) {
  return request<API.ProcessItem>(`/api/daciProductionProcesses/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取所有工序（用于下拉选择） */
export async function getAllProcesses() {
  return getProcessList({
    current: 1,
    pageSize: 999, // 获取所有工序
  });
}