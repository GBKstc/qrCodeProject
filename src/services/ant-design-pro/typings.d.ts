type CurrentUser = {
  id?: number;
  name?: string;
  username?: string;
  mobile?: string;
  password?: string;
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  credentialsNonExpired?: boolean;
  enabled?: boolean;
  authorities?: any[];
  authList?: any[];
  attach?: any;
  avatar?: string;
  userid?: string;
  email?: string;
  signature?: string;
  title?: string;
  group?: string;
  tags?: { key?: string; label?: string }[];
  notifyCount?: number;
  unreadCount?: number;
  country?: string;
  access?: string;
  geographic?: {
    province?: { label?: string; key?: string };
    city?: { label?: string; key?: string };
  };
  address?: string;
  phone?: string;
};

type LoginResult = {
  // 直接返回用户信息，不包装在 data 中
  id?: number;
  name?: string;
  username?: string;
  mobile?: string;
  password?: string;
  accountNonExpired?: boolean;
  accountNonLocked?: boolean;
  credentialsNonExpired?: boolean;
  enabled?: boolean;
  authorities?: any[];
  authList?: any[];
  attach?: any;
};

type LoginParams = {
  userName: string;
  passWord: string;
  autoLogin?: boolean;
  type?: string;
};

type PageParams = {
  current?: number;
  pageSize?: number;
};

type RuleListItem = {
  key?: number;
  disabled?: boolean;
  href?: string;
  avatar?: string;
  name?: string;
  owner?: string;
  desc?: string;
  callNo?: number;
  status?: number;
  updatedAt?: string;
  createdAt?: string;
  progress?: number;
};

type RuleList = {
  data?: RuleListItem[];
  /** 列表的内容总数 */
  total?: number;
  success?: boolean;
};

type FakeCaptcha = {
  code?: number;
  status?: string;
};

type LoginParams = {
  username?: string;
  password?: string;
  autoLogin?: boolean;
  type?: string;
};

type ErrorResponse = {
  /** 业务约定的错误码 */
  errorCode: string;
  /** 业务上的错误信息 */
  errorMessage?: string;
  /** 业务上的请求是否成功 */
  success?: boolean;
};

type NoticeIconList = {
  data?: NoticeIconItem[];
  /** 列表的内容总数 */
  total?: number;
  success?: boolean;
};

type NoticeIconItemType = 'notification' | 'message' | 'event';

type NoticeIconItem = {
  id?: string;
  extra?: string;
  key?: string;
  read?: boolean;
  avatar?: string;
  title?: string;
  status?: string;
  datetime?: string;
  description?: string;
  type?: NoticeIconItemType;
};


type ProcessItem = {
  id?: string;
  name?: string;
  description?: string;
  sequence?: number;
  status?: number; // 状态：0-禁用，1-启用
  createTime?: string;
  updateTime?: string;
  createBy?: string;
  updateBy?: string;
};

type ProcessListResult = {
  data?: ProcessItem[];
  total?: number;
  success?: boolean;
  current?: number;
  pageSize?: number;
};
