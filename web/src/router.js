import Main from './views/main.vue'

const signinRouter = {
  path: '/signin',
  name: 'signin',
  meta: {title: '登录'},
  component: (resolve) => require(['./views/signin.vue'], resolve)
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
      component: (resolve) => require(['./views/home.vue'], resolve)
    }
  ]
};

const appRouter = [{
  path: '/account',
  name: 'account',
  meta: {title: '账户管理'},
  access: 'admin',
  component: Main,
  children: [
    {
      path: 'index',
      name: 'account_index',
      access: 'admin',
      component: (resolve) => require(['./views/account.vue'], resolve)
    }
  ]
}, {
  path: '/link',
  name: 'link',
  meta: {title: '链接管理'},
  access: 'admin',
  component: Main,
  children: [
    {
      path: 'index',
      name: 'link_index',
      access: 'admin',
      component: (resolve) => require(['./views/link.vue'], resolve)
    }
  ]
}, {
  path: '/qr',
  name: 'qr',
  meta: {title: '二维码生成'},
  access: 'admin',
  component: Main,
  children: [
    {
      path: 'index',
      name: 'qr_index',
      access: 'admin',
      component: (resolve) => require(['./views/QR.vue'], resolve)
    }
  ]
}];

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