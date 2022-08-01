import router from '@/router';
import store from '@/store';
import { utilSelf } from '@/utils/util';

const whiteList = ['/404', '/error', '/login'];

// 单点登录截取code备用
router.beforeEach(async (to, from, next) => {
  // if (store.getters.token) {
  if (whiteList.indexOf(to.path) !== -1) {
    next('/');
  } else {
    next();
  }
  // } else {
  //   if (to.query.code) {
  //     try {
  //       await store.dispatch('user/xGetToken', to.query.code);
  //       next({ path: '/', query: {}, replace: true });
  //       return;
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  // if (whiteList.indexOf(to.path) !== -1) {
  //   next();
  // } else {
  //   const { VUE_APP_APP_RETURN_URL, VUE_APP_APP_CODE } = process.env;
  //   if (process.env.NODE_ENV === 'production') {
  //     window.location.replace(`/mp-login/?app-code=${VUE_APP_APP_CODE}&return-url=${VUE_APP_APP_RETURN_URL}`);
  //   } else {
  //     window.location.replace(`http://192.168.5.213/mp-login/?app-code=${VUE_APP_APP_CODE}&return-url=http://localhost:8080/model/`);
  //   }
  // }
  // }
});
router.afterEach(to => {
  // let headerData = window.location.search;
  // if (to.path == '/') {
  //   store.dispatch('app/xSetSearchItem', headerData != '?from=ec-levault');
  // }
});

export default router;
