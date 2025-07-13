import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message, notification } from 'antd';
import { history } from '@umijs/max';

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}

// 与后端约定的响应数据格式
interface ResponseStructure {
  success?: boolean;
  code?: number;
  message?: string;
  data?: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
  error?: string;
}

export const errorConfig: RequestConfig = {
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const response = res as unknown as ResponseStructure;
      
      // 检查是否为 Unauthorized 错误
      if (response.error === 'Unauthorized' || response.message === 'Unauthorized' || response.code === 401) {
        // 清除本地存储的登录信息
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        // 跳转到登录页面
        history.push('/user/login');
        message.error('登录已过期，请重新登录');
        return;
      }
      
      // 适配不同的后端返回格式
      // 如果有 success 字段，以 success 为准
      if (response.success !== undefined && !response.success) {
        const error: any = new Error(response.errorMessage || response.message || '请求失败');
        error.name = 'BizError';
        error.info = { 
          errorCode: response.errorCode || response.code, 
          errorMessage: response.errorMessage || response.message, 
          showType: response.showType,
          data: response.data 
        };
        throw error;
      }
      
      // 如果没有 success 字段，根据 code 判断（通常 200 表示成功）
      if (response.code !== undefined && response.code !== 200) {
        const error: any = new Error(response.message || '请求失败');
        error.name = 'BizError';
        error.info = { 
          errorCode: response.code, 
          errorMessage: response.message, 
          showType: response.showType,
          data: response.data 
        };
        throw error;
      }
    },
    
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      
      // 检查 HTTP 状态码 401 (Unauthorized)
      if (error.response?.status === 401) {
        // 清除本地存储的登录信息
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        // 跳转到登录页面
        history.push('/user/login');
        message.error('登录已过期，请重新登录');
        return;
      }
      
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warning(errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              message.error(errorMessage);
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(`Response status:${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      const url = config?.url?.concat('?token = 123');
      return { ...config, url };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response as unknown as ResponseStructure;

      // 检查响应数据中的 Unauthorized 错误
      if (data?.error === 'Unauthorized' || data?.message === 'Unauthorized') {
        // 清除本地存储的登录信息
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        // 跳转到登录页面
        history.push('/user/login');
        message.error('登录已过期，请重新登录');
        return response;
      }

      // if (data?.success === false) {
      //   message.error('请求失败！');
      // }
      return response;
    },
  ],
};
