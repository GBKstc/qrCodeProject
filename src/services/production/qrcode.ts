import { request } from '@umijs/max';

/** 二维码管理分页查询 GET /api/daciQrcode/pageList */
export async function getQRCodeList(
  params: {
    /** 批次号 */
    batchCode?: string;
    /** 编号 */
    code?: string;
    /** 页码,默认1 */
    currPage?: number;
    /** 设备id */
    deviceId?: number;
    /** 数量 */
    num?: number;
    /** 操作人 */
    operateId?: number;
    /** 操作人名称 */
    operateName?: string;
    /** 数量,默认10 */
    pageSize?: number;
    /** 备注 */
    remark?: string;
    /** 序号 */
    sort?: number;
    /** 状态 0未使用 1已使用 */
    status?: number;
    /** 链接 */
    url?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.QRCodeListResult>('/api/daciQrcode/pageList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 保存或更新二维码 POST /api/daciQrcode/saveOrUpdate */
export async function saveOrUpdateQRCode(body: API.DaciQrcodeSaveParam, options?: { [key: string]: any }) {
  return request<API.CommonResponse>('/api/daciQrcode/saveOrUpdate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除二维码 DELETE /api/daciQrcode/{id} */
export async function deleteQRCode(id: number, options?: { [key: string]: any }) {
  return request<API.CommonResponse>(`/api/daciQrcode/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 获取二维码详情 GET /api/daciQrcode/{id} */
export async function getQRCodeDetail(id: number, options?: { [key: string]: any }) {
  return request<API.QRCodeItem>(`/api/daciQrcode/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 批量生成二维码 POST /api/daciQrcode/batchGenerate */
export async function batchGenerateQRCode(
  body: {
    quantity: number;
    accessUrl: string;
    deviceId?: number;
    remark?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.CommonResponse>('/api/daciQrcode/batchGenerate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 导出二维码 GET /api/daciQrcode/export */
export async function exportQRCode(
  params: {
    /** 二维码ID */
    id: number;
    /** 设备ID */
    deviceId: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    body?: any;
    statusCode?: string;
    statusCodeValue?: number;
  }>('/api/daciQrcode/export', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}