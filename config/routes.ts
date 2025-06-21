export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/system',
    name: 'system',
    icon: 'setting',
    access: 'canAdmin',
    routes: [
      {
        path: '/system',
        redirect: '/system/role',
      },
      {
        path: '/system/role',
        name: 'role',
        component: './System/Role',

      },
      {
        path: '/system/role/permission',  // 使用相对路径
        name: 'permission',
        component: './System/Permission',
        hideInMenu: true,
      },
      {
        path: '/system/account',
        name: 'account',
        component: './System/Account',
      },
    ],
  },
  {
    path: '/production',
    name: 'production',
    icon: 'tool',
    routes: [
      {
        path: '/production',
        redirect: '/production/process',
      },
      {
        path: '/production/process',
        name: 'process',
        component: './Production/Process',
      },
      {
        path: '/production/equipment',
        name: 'equipment',
        component: './Production/Equipment',
      },
      {
        path: '/production/equipment/overview',
        name: 'equipment-overview',
        component: './Production/EquipmentOverview',
      },
      {
        path: '/production/qrcode',
        name: 'qrcode',
        component: './Production/QRCode',
      },
      {
        path: '/production/product',
        name: 'product',
        component: './Production/Product',
      },
      {
        path: '/production/info',
        name: 'production-info',
        component: './Production/ProductionInfo',
      },
      {
        path: '/production/display',
        name: 'display',
        component: './Production/Display',
      },
    ],
  },
  
 
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
