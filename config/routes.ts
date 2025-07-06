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
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/system/role',
        name: 'role',
        access: 'canViewRole',
        component: './System/Role',
      },
      {
        path: '/system/permission',
        name: 'permission', 
        access: 'canViewPermission',
        component: './System/Permission',
        //菜单栏不展示
        hideInMenu: true,
      },
      {
        path: '/system/account',
        name: 'account',
        access: 'canViewAccount',
        component: './System/Account',
      },
    ],
  },
  {
    path: '/production',
    name: 'production',
    icon: 'table',
    access: 'canProduction',
    routes: [
      {
        path: '/production/process',
        name: 'process',
        access: 'canViewProcess',
        component: './Production/Process',
      },
      {
        path: '/production/equipment',
        name: 'equipment',
        access: 'canViewEquipment',
        component: './Production/Equipment',
      },
      {
        path: '/production/qrcode',
        name: 'qrcode',
        access: 'canViewQRCode',
        component: './Production/QRCode',
      },
      {
        path: '/production/product',
        name: 'product',
        access: 'canViewProduct',
        component: './Production/Product',
      },
      {
        path: '/production/info',
        name: 'productionInfo',
        access: 'canViewProductionInfo',
        component: './Production/ProductionInfo',
      },
      {
        path: '/production/display',
        name: 'display',
        access: 'canViewDisplay',
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
