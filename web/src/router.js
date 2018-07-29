import Main from './views/main.vue';

const signinRouter = {
  path: '/signin',
  name: 'signin',
  meta: { title: '登录' },
  component: resolve => require(['./views/signin.vue'], resolve)
};

const otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: '/home',
  component: Main,
  children: [
    {
      path: 'home',
      name: 'home_index',
      component: resolve => require(['./views/home.vue'], resolve)
    }
  ]
};

const appRouter = [
  {
    path: '/chart',
    name: 'chart',
    meta: { title: '图表' },
    access: 'admin',
    component: Main,
    children: [
      {
        path: 'index',
        name: 'chart_index',
        access: 'admin',
        component: resolve => require(['./views/chart.vue'], resolve)
      }
    ]
  },
  {
    path: '/account',
    name: 'account',
    meta: { title: '账户管理' },
    access: 'admin',
    component: Main,
    children: [
      {
        path: 'index',
        name: 'account_index',
        access: 'admin',
        component: resolve => require(['./views/account.vue'], resolve)
      }
    ]
  },
  {
    path: '/oaccount',
    name: 'oaccount',
    meta: { title: '组织账户' },
    access: 'admin',
    component: Main,
    children: [
      {
        path: 'index',
        name: 'oaccount_index',
        access: 'admin',
        component: resolve => require(['./views/oaccount/index.vue'], resolve)
      }
    ]
  },
  {
    path: '/product',
    name: 'product',
    meta: { title: '产品管理' },
    access: 'admin',
    component: Main,
    children: [
      {
        path: 'index',
        name: 'product_index',
        access: 'admin',
        component: resolve => require(['./views/product.vue'], resolve)
      }
    ]
  },
  {
    path: '/access',
    name: 'access',
    meta: { title: '访问信息' },
    access: 'admin',
    component: Main,
    children: [
      {
        path: 'index',
        name: 'access_index',
        access: 'admin',
        component: resolve => require(['./views/access.vue'], resolve)
      }
    ]
  },
  {
    path: '/linkTemplate',
    name: 'linkTemplate',
    meta: { title: '链接模板' },
    access: 'admin',
    component: Main,
    children: [
      {
        path: 'index',
        name: 'linkTemplate_index',
        access: 'admin',
        component: resolve => require(['./views/linkTemplate.vue'], resolve)
      }
    ]
  },
  {
    path: '/order',
    name: 'order',
    meta: { title: '订单管理' },
    access: 'admin',
    component: Main,
    children: [
      {
        path: 'index',
        name: 'order_index',
        access: 'admin',
        component: resolve => require(['./views/order.vue'], resolve)
      }
    ]
  },
  {
    path: '/resource',
    name: 'resource',
    meta: { title: '资源管理' },
    access: 'admin',
    component: Main,
    children: [
      {
        path: 'index',
        name: 'resource_index',
        access: 'admin',
        component: resolve => require(['./views/resource.vue'], resolve)
      }
    ]
  },
  {
    path: '/domain',
    name: 'domain',
    meta: { title: '域名管理' },
    access: 'admin',
    component: Main,
    children: [
      {
        path: 'index',
        name: 'domain_index',
        access: 'admin',
        component: resolve => require(['./views/domain.vue'], resolve)
      }
    ]
  },
  {
    path: '/qr',
    name: 'qr',
    meta: { title: '二维码生成' },
    access: 'admin',
    component: Main,
    children: [
      {
        path: 'index',
        name: 'qr_index',
        access: 'admin',
        component: resolve => require(['./views/QR.vue'], resolve)
      }
    ]
  }
];

const routers = [
  signinRouter,
  otherRouter,
  ...appRouter
]; /*[{
    path: '/',
    name: 'index',
    access: true,
    meta: {title: '北坡推广'},
    component: (resolve) => require(['./views/index.vue'], resolve)
}, ];*/
export default routers;
