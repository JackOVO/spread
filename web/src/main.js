import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import Vuex from 'vuex';
import Util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import './styles/main.css';

Vue.use(VueRouter);
Vue.use(Vuex);

Vue.use(iView);

// 路由配置
const RouterConfig = {
  mode: 'history',
  routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  Util.title(to.meta.title);

  // sessionStorage.username = data.username;
  // sessionStorage.role = data.role;
  if (!sessionStorage.account_id && to.name !== 'signin') {
    next({ name: 'signin' });
  } else if (sessionStorage.account_id && to.name === 'signin') {
    next({ name: 'home_index' });
  } else {
    if (to.access) {
      next({ name: 'signin' });
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});

const store = new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {}
});

new Vue({
  el: '#app',
  router: router,
  store: store,
  render: h => h(App)
});
