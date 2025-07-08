import { request } from '@umijs/max';

// 生产信息分页查询参数
export interface ProductionInfoParams {
  batchCode?: string;           // 批次
  colour?: string;              // 釉色
  currPage?: number;            // 页码,默认1
  endProduceTime?: string;      // 结束生产时间
  endShareProductTime?: string; // 结束展示生产时间
  operateId?: number;           // 操作人
  operateName?: string;         // 操作人名称
  pageSize?: number;            // 数量,默认10
  productId?: number;           // 产品id
  productThumb?: string;        // 产品图片
  qrcodeId?: number;            // 二维码id
  qrcodeUrl?: string;           // 二维码
  remark?: string;              // 备注
  shareBatchCode?: string;      // 展示批次号
  size?: string;                // 型号
  startProduceTime?: string;    // 开始生产时间
  startShareProductTime?: string; // 开始展示生产时间
  thumbCode?: string;           // 图号
  trademark?: string;           // 商标
}

// 生产信息项
export interface ProductionInfoItem {
  id: number;
  batchCode: string;
  colour: string;
  createTime: string;
  operateId: number;
  operateName: string;
  produceTime: string;
  produceUserList: {
    createTime: string;
    id: number;
    operateId: number;
    operateName: string;
    produceId: number;
    productionProcessesId: number;
    productionProcessesName: string;
    remark: string;
    updateTime: string;
  }[];
  productThumb: string;
  qrcodeId: number;
  qrcodeUrl: string;
  remark: string;
  shareBatchCode: string;
  shareProductTime: string;
  size: string;
  thumbCode: string;
  trademark: string;
  updateTime: string;
}

// 分页响应结果
export interface ProductionInfoListResult {
  countId: string;
  current: number;
  maxLimit: number;
  optimizeCountSql: boolean;
  orders: {
    asc: boolean;
    column: string;
  }[];
  pages: number;
  records: ProductionInfoItem[];
  searchCount: boolean;
  size: number;
  total: number;
}

// 获取生产信息列表
export async function getProductionInfoList(params: ProductionInfoParams) {
  return request<{
    success: boolean;
    message: string;
    code: string;
    data: ProductionInfoListResult;
  }>('/api/daciProduce/pageList', {
    method: 'GET',
    params,
  });
}