import { Footer } from '@/components';
import { login } from '@/services/ant-design-pro/api';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl, useModel, Helmet } from '@umijs/max';
import { Alert, message } from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, { useState } from 'react';
import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token }) => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [loginError, setLoginError] = useState<string>(''); // 添加错误状态管理
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const intl = useIntl();

  // 在 handleSubmit 函数中，完善用户信息存储
  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 清除之前的错误信息
      setLoginError('');
      setUserLoginState({});
      
      const loginParams = {
        userName: values.userName,
        passWord: values.passWord,
      };
      
      const response = await login(loginParams);
      console.log('登录响应:', response);
      
      const data = response.data;
      if (data && data.id) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        
        // 存储完整的用户信息到 localStorage
        localStorage.setItem('userName', data.name || data.username || '');
        localStorage.setItem('userInfo', JSON.stringify(data));
        localStorage.setItem('userId', data.id.toString());
        
        // 如果后端返回 token，也存储
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        // 存储权限信息（便于快速访问）
        if (data.authList) {
          localStorage.setItem('userPermissions', JSON.stringify(data.authList));
        }
        
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      }
      
      // 登录失败处理 - 只设置错误状态，不显示message
      const errorMessage = response.message || '账户或密码错误';
      setLoginError(errorMessage);
      setUserLoginState({ status: 'error' });
    } catch (error: any) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      
      let errorMessage = defaultLoginFailureMessage;
      if (error.name === 'BizError') {
        errorMessage = error.info?.errorMessage || defaultLoginFailureMessage;
      }
      
      // 只设置错误状态，不显示message
      setLoginError(errorMessage);
      setUserLoginState({ status: 'error' });
    }
  };

  const { status } = userLoginState;

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'menu.login',
            defaultMessage: '登录页',
          })}
          - {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/image.png" style={{ width: '44px', height: '44px' }} />}
          title="二维码系统"
          subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          {/* 统一的错误提示 - 只在有错误时显示 */}
          {loginError && (
            <LoginMessage content={loginError} />
          )}
          
          <ProFormText
            name="userName"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder="用户名"
            rules={[
              {
                required: true,
                message: "请输入用户名!",
              },
            ]}
          />
          <ProFormText.Password
            name="passWord"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder="密码"
            rules={[
              {
                required: true,
                message: "请输入密码！",
              },
            ]}
          />
          
          {/* <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              记住密码
            </ProFormCheckbox>
          </div> */}
        </LoginForm>
      </div>
    </div>
  );
};

export default Login;
