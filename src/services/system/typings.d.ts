declare namespace API {
  // 角色管理相关类型
  type RoleItem = {
    id?: number;
    companyId?: number; // 公司ID
    roleCode?: string; // 角色编码
    roleName?: string; // 角色名称
    remark?: string; // 备注
    operatorId?: number; // 操作人ID
    operatorName?: string; // 操作人姓名
    createTime?: string;
    updateTime?: string;
    authVOList?: AuthVO[]; // 权限列表
  };

  // 权限信息类型
  type AuthVO = {
    id?: number;
    menuId?: number; // 菜单ID
    menuName?: string; // 菜单名称
    roleId?: number; // 角色ID
    roleTemplateId?: number; // 角色模板ID
    operatorId?: number; // 操作人ID
    operatorName?: string; // 操作人姓名
    remark?: string; // 备注
    createTime?: string;
    updateTime?: string;
  };

  // 角色分页查询参数
  type RolePageParams = {
    companyId?: number; // 公司ID
    currPage?: number; // 页码,默认1
    operatorId?: number; // 操作人ID
    operatorName?: string; // 操作人姓名
    pageSize?: number; // 数量,默认10
    remark?: string; // 备注
    roleCode?: string; // 角色编码
    roleName?: string; // 角色名称
  };

  // 角色分页查询结果
  type RoleListResult = {
    success?: boolean;
    message?: string;
    code?: string;
    data?: {
      records?: RoleItem[];
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

  // 通用响应类型
  type SystemCommonResponse = {
    success?: boolean;
    message?: string;
    code?: string;
    data?: any;
    reason?: {
      errMsg?: string;
      exFrom?: string;
    } | null;
  };

  // 权限保存参数类型
  type AuthSaveParam = {
    menuId?: number; // 菜单ID
    roleId?: number; // 角色ID
  };

  // 角色保存/更新参数类型
  type RoleSaveParam = {
    authSaveParamList?: AuthSaveParam[]; // 权限列表
    companyId?: number; // 公司ID
    del?: number; // 删除标识
    id?: number; // 角色ID（编辑时使用）
    roleCode?: string; // 角色编码
    roleName?: string; // 角色名称
  };

  // 更新现有的 RoleItem 类型
  type RoleItem = {
    id?: number;
    companyId?: number; // 公司ID
    roleCode?: string; // 角色编码
    roleName?: string; // 角色名称
    remark?: string; // 备注
    operatorId?: number; // 操作人ID
    operatorName?: string; // 操作人姓名
    createTime?: string;
    updateTime?: string;
    authVOList?: AuthVO[]; // 权限列表
    del?: number; // 删除标识
  };

  // 用户权限信息类型
  type UserAuthVO = {
    createTime?: string;
    id?: number;
    menuId?: number; // 菜单ID
    menuName?: string; // 菜单名称
    operatorId?: number; // 操作人ID
    operatorName?: string; // 操作人姓名
    remark?: string; // 备注
    roleId?: number; // 角色ID
    roleTemplateId?: number; // 角色模板ID
    updateTime?: string;
  };

  // 用户角色信息类型
  type UserRoleVO = {
    createTime?: string;
    id?: number;
    operatorId?: number; // 操作人ID
    operatorName?: string; // 操作人姓名
    remark?: string; // 备注
    roleId?: number; // 角色ID
    roleName?: string; // 角色名称
    updateTime?: string;
    userAuthVOList?: UserAuthVO[]; // 用户权限列表
    userId?: number; // 用户ID
  };

  // 账户信息类型
  type AccountItem = {
    id?: number;
    companyId?: number; // 公司ID
    createTime?: string;
    dcDepartmentId?: number; // 所属部门ID
    dcDepartmentName?: string; // 所属部门名称
    dcProduceLineId?: number; // 所属车间ID
    dcProductLineName?: string; // 所属车间名称
    del?: number; // 删除标识
    mobile?: string; // 手机号
    name?: string; // 姓名
    operatorId?: number; // 操作人ID
    operatorName?: string; // 操作人姓名
    password?: string; // 密码
    post?: string; // 岗位
    updateTime?: string;
    workNumber?: string; // 工号
    authVOList?: UserRoleVO[]; // 角色权限列表
  };

  // 账户分页查询参数
  type AccountPageParams = {
    companyId?: number; // 公司ID
    currPage?: number; // 页码,默认1
    dcDepartmentId?: number; // 所属部门ID
    dcDepartmentName?: string; // 所属部门名称
    dcProduceLineId?: number; // 所属车间ID
    dcProductLineName?: string; // 所属车间名称
    dcRoleName?: string; // 所属角色名称
    mobile?: string; // 手机号
    name?: string; // 姓名
    operatorId?: number; // 操作人ID
    operatorName?: string; // 操作人姓名
    pageSize?: number; // 数量,默认10
    password?: string; // 密码
    post?: string; // 岗位
    roleId?: number; // 角色ID
    workNumber?: string; // 工号
  };

  // 账户分页查询结果
  type AccountListResult = {
    success?: boolean;
    message?: string;
    code?: string;
    data?: {
      records?: AccountItem[];
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

  // 账户保存/更新参数类型
  type AccountSaveParam = {
    companyId?: number; // 公司ID
    dcDepartmentId?: number; // 所属部门ID
    dcDepartmentName?: string; // 所属部门名称
    dcProduceLineId?: number; // 所属车间ID
    dcProductLineName?: string; // 所属车间名称
    id?: number; // 账户ID（编辑时使用）
    mobile?: string; // 手机号
    name?: string; // 姓名
    operatorId?: number; // 操作人ID
    operatorName?: string; // 操作人姓名
    password?: string; // 密码
    post?: string; // 岗位
    roleList?: any[]; // 角色列表
    workNumber?: string; // 工号
  };
}