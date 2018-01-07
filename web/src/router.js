const routers = [{
    path: '/',
    name: 'index',
    meta: {title: '北坡推广'},
    component: (resolve) => require(['./views/index.vue'], resolve)
}, {
    path: '/signin',
    meta: {title: '登录'},
    component: (resolve) => require(['./views/signin.vue'], resolve)
}];
export default routers;