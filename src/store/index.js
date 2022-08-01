/*
 * @Author: liupeixin liupx@nancal.com
 * @Date: 2022-06-01 17:11:29
 * @LastEditors: liupeixin liupx@nancal.com
 * @LastEditTime: 2022-06-03 23:11:37
 * @FilePath: /digital-process-ui/personal-work/src/store/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import getters from './getters';
const path = require('path');

Vue.use(Vuex);

const req = require.context('./modules', false, /.js$/);

const requireAll = file =>
  file.keys().reduce((modules, e) => {
    let name = path.basename(e, '.js');
    modules[name] = file(e).default;
    return modules;
  }, {});

export default new Vuex.Store({
  state: {
    token: '5m074ssgf20x', // 接受乐造os传递过来的token参数
    LOADING: false,
  },
  getters,
  mutations: {
    SET_TOKEN(state, data) {
      state.token = data;
    },
    SET_LOADING(state, payload) {
      state.LOADING = payload;
    },
  },
  actions: {
  },
  modules: {
    ...requireAll(req),
  },
  plugins: [createPersistedState({ storage: window.sessionStorage, key: process.env.VUE_APP_STORE_KEY })],
});

// // 获取token信息
// async getTokenByCode({ commit, dispatch }, code) {
//   try {
//       const { data } = await getToken({ code });
//       commit('SET_TOKEN', data.data);
//       await dispatch('getUserInfo');
//       return data.data;
//   } catch (e) {
//       return Promise.reject(e);
//       console.log(e);
//   }
// },
// // 获取用户信息
// async getUserInfo({ commit }) {
//   try {
//       const { data } = await getUserInfo();
//       commit('SET_USER_INFO', data.data);
//   } catch (e) {
//       return Promise.reject(e);
//       console.log(e);
//   }
// },
// // 退出登录
// async logout({ commit }) {
//   try {
//       const { data } = await logout();
//       commit('LOGO_OUT');
//       // 删除本地存储中的token，这个token是集成企业容器存储的
//       window.localStorage.removeItem('digitalthread:token');
//       await router.push({ path: '/', query: { t: `${new Date().getTime()}` } });
//   } catch (e) {
//       return Promise.reject(e);
//       console.log(e);
//   }
// },
