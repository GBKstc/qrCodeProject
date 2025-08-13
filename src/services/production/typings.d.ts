declare namespace API {
  type ProcessItem = {
    id?: string | number;
    name?: string;
    description?: string; // 前端使用 description
    sequence?: number; // 前端使用 sequence
    status?: number; // 状态：0-禁用，1-启用
    createTime?: string;
    updateTime?: string;
    createBy?: string;
    updateBy?: string;
  };

  type ProcessListResult = {
    data?: {
      records?: ProcessItem[];
      total?: number;
      current?: number;
      size?: number;
      pages?: number;
    };
    success?: boolean;
    message?: string;
    code?: string;
  };

  // 接口原始数据结构
  type ProcessApiItem = {
    id?: number;
    name?: string;
    descript?: string; // 接口字段
    sort?: number; // 接口字段
    operateId?: number;
    operateName?: string;
    remark?: string;
    createTime?: string | null;
    updateTime?: string | null;
  };

  // 接口响应结构
  type ProcessApiResponse = {
    success: boolean;
    message: string;
    code: string;
    data: {
      records: ProcessApiItem[];
      total: number;
      size: number;
      current: number;
      pages: number;
    };
    reason?: {
      errMsg?: string;
      exFrom?: string;
    } | null;
  };

  // 设备管理相关类型
  type EquipmentItem = {
    id?: number;
    name?: string;
    operateId?: number;
    operateName?: string;
    productionProcessesId?: number;
    productionProcessesName?: string;
    remark?: string;
    sort?: number;
    type?: number;
    createTime?: string;
    updateTime?: string;
  };

  type EquipmentApiItem = {
    id?: number;
    name?: string;
    operateId?: number;
    operateName?: string;
    productionProcessesId?: number;
    remark?: string;
    sort?: number;
    type?: number;
    del?: number; // 删除标记
  };

  type EquipmentListResult = {
    success?: boolean;
    message?: string;
    code?: string;
    data?: {
      records?: EquipmentItem[];
      total?: number;
      current?: number;
      size?: number;
      pages?: number;
      countId?: string;
      maxLimit?: number;
      optimizeCountSql?: boolean;
      orders?: Array<{
        asc?: boolean;
        column?: string;
      }>;
      searchCount?: boolean;
    };
    reason?: {
      errMsg?: string;
      exFrom?: string;
    } | null;
  };

  type CommonResponse = {
    success?: boolean;
    message?: string;
    code?: string;
    data?: any;
    reason?: {
      errMsg?: string;
      exFrom?: string;
    } | null;
  };

  // 产品管理相关类型
  type ProductItem = {
    id?: number;
    name?: string; // 产品名称
    batchCode?: string; // 批次
    colour?: string; // 釉色
    operateId?: number;
    operateName?: string;
    productThumb?: string; // 产品图片
    remark?: string;
    size?: string; // 型号
    thumbCode?: string; // 图号
    trademark?: string; // 商标
    trademarkImage?: string; // 商标图片
    createTime?: string;
    updateTime?: string;
  };

  type ProductApiItem = {
    id?: number;
    name?: string; // 产品名称
    batchCode?: string;
    colour?: string;
    operateId?: number;
    operateName?: string;
    productThumb?: string;
    remark?: string;
    size?: string;
    thumbCode?: string;
    trademark?: string;
    trademarkImage?: string; // 商标图片
    del?: number; // 删除标记
  };

  type ProductListResult = {
    success?: boolean;
    message?: string;
    code?: string;
    data?: {
      records?: ProductItem[];
      total?: number;
      current?: number;
      size?: number;
      pages?: number;
      countId?: string;
      maxLimit?: number;
      optimizeCountSql?: boolean;
      orders?: Array<{
        asc?: boolean;
        column?: string;
      }>;
      searchCount?: boolean;
    };
    reason?: {
      errMsg?: string;
      exFrom?: string;
    } | null;
  };

  // 展示信息管理相关类型
  type DisplayItem = {
    id?: number;
    code?: string; // 字段编号
    name?: string; // 名称
    isShow?: number; // 是否展示 0不展示 1展示
    operateId?: number;
    operateName?: string;
    remark?: string;
    createTime?: string;
    updateTime?: string;
  };

  type DisplayApiItem = {
    id?: number;
    code?: string;
    name?: string;
    isShow?: number;
    operateId?: number;
    operateName?: string;
    remark?: string;
    del?: number; // 删除标记
  };

  type DisplayListResult = {
    success?: boolean;
    message?: string;
    code?: string;
    data?: {
      records?: DisplayItem[];
      total?: number;
      current?: number;
      size?: number;
      pages?: number;
      countId?: string;
      maxLimit?: number;
      optimizeCountSql?: boolean;
      orders?: Array<{
        asc?: boolean;
        column?: string;
      }>;
      searchCount?: boolean;
    };
    reason?: {
      errMsg?: string;
      exFrom?: string;
    };
  };

  // 二维码管理相关类型
  type QRCodeItem = {
    id?: number;
    batchCode?: string; // 序列号
    code?: string; // 编号
    deviceId?: number; // 设备id
    num?: number; // 数量
    operateId?: number; // 操作人
    operateName?: string; // 操作人名称
    remark?: string; // 备注
    sort?: number; // 序号
    status?: number; // 状态 0未使用 1已使用
    url?: string; // 链接
    createTime?: string;
    updateTime?: string;
  };

  // 二维码保存参数类型
  type DaciQrcodeSaveParam = {
    id?: number;
    batchCode?: string; // 序列号
    num?: number; // 数量
    sort?: number; // 序号
    url?: string; // 链接
  };

  type QRCodeApiItem = {
    id?: number;
    batchCode?: string;
    code?: string;
    deviceId?: number;
    num?: number;
    operateId?: number;
    operateName?: string;
    remark?: string;
    sort?: number;
    status?: number;
    url?: string;
    createTime?: string;
    updateTime?: string;
  };

  type QRCodeListResult = {
    success?: boolean;
    message?: string;
    code?: string;
    data?: {
      records?: QRCodeItem[];
      total?: number;
      current?: number;
      size?: number;
      pages?: number;
      countId?: string;
      maxLimit?: number;
      optimizeCountSql?: boolean;
      orders?: Array<{
        asc?: boolean;
        column?: string;
      }>;
      searchCount?: boolean;
    };
    reason?: {
      errMsg?: string;
      exFrom?: string;
    } | null;
  };
}

// 生产信息相关类型
export interface ProductionInfoItem {
  id: number;
  batchCode: string;
  colour: string;
  createTime: string;
  operateId: number;
  operateName: string;
  produceTime: string;
  produceUserList: ProductionUserItem[];
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

export interface ProductionUserItem {
  createTime: string;
  id: number;
  operateId: number;
  operateName: string;
  produceId: number;
  productionProcessesId: number;
  productionProcessesName: string;
  remark: string;
  updateTime: string;
}

export interface ProductionInfoParams {
  batchCode?: string;
  colour?: string;
  currPage?: number;
  endProduceTime?: string;
  endShareProductTime?: string;
  operateId?: number;
  operateName?: string;
  pageSize?: number;
  productId?: number;
  productThumb?: string;
  qrcodeId?: number;
  qrcodeUrl?: string;
  remark?: string;
  shareBatchCode?: string;
  size?: string;
  startProduceTime?: string;
  startShareProductTime?: string;
  thumbCode?: string;
  trademark?: string;
}

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