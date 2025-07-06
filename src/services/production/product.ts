import { request } from '@umijs/max';

/** 获取产品列表 */
export async function getProductList(
  params: {
    /** 页码,默认1 */
    currPage?: number;
    /** 数量,默认10 */
    pageSize?: number;
    /** 批次 */
    batchCode?: string;
    /** 釉色 */
    colour?: string;
    /** 操作人 */
    operateId?: number;
    /** 操作人名称 */
    operateName?: string;
    /** 产品图片 */
    productThumb?: string;
    /** 备注 */
    remark?: string;
    /** 型号 */
    size?: string;
    /** 图号 */
    thumbCode?: string;
    /** 商标 */
    trademark?: string;
  },
  options?: { [key: string]: any },
) {
  return request<API.ProductListResult>('/api/daciProduct/pageList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新增或更新产品 */
export async function saveOrUpdateProduct(
  data: API.ProductApiItem,
  options?: { [key: string]: any },
) {
  return request<API.CommonResponse>('/api/daciProduct/saveOrUpdate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...(options || {}),
  });
}

/** 删除产品 */
export async function removeProduct(
  id: number,
  options?: { [key: string]: any },
) {
  return request<API.CommonResponse>('/api/daciProduct/saveOrUpdate', {
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