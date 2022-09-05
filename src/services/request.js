import axios from 'axios';
import store from '@/store';
import { Modal, message } from 'ant-vue-nancal';
import { utilSelf } from '@/utils/util';

let shadeNum = 0;
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,

  // 超时
  timeout: 50 * 1000,
});

service.interceptors.request.use(
  config => {
    // let token = utilSelf.getStorage('lowCode:token');
    // const currentAppId = utilSelf.getStorage('currentAppId');
    // if (token) {
    //   config.headers.token = token;
    //   config.headers.appId = currentAppId;
    // }

    //----------------------原有token逻辑 start-----------------------------
    config.headers['token'] = store.state.token;
    config.headers['Authorization'] = `Bearer ${store.state.token}`;
    // config.headers['tenantId'] = store.state.tenantId;
    // config.headers['tenantId'] = '6217672e7e07b718ffb54904';
    //----------------------------原有token逻辑 end-------------------------------------

    if (config.method == 'GET') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    // 统一遮照
    let shade = config.shade === undefined ? true : config.shade;
    if (!!shade && typeof store.dispatch === 'function') {
      // store.dispatch('app/setData', {
      //   key: 'loading',
      //   data: true,
      // });
      shadeNum++;
    }
    return config;
  },
  error => {
    message.error('请求超时');
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  res => {
    let shade = res.config.shade == undefined ? true : res.config.shade;
    if (!!shade && typeof store.dispatch === 'function') {
      if (shadeNum > 0) {
        shadeNum--;
      }
      if (shadeNum === 0) {
        // store.dispatch('app/setData', {
        //   key: 'loading',
        //   data: false,
        // });
      }
    }
    if (!res.data?.code) {
      return res.data || res.value;
    }
    if (res.data?.code === -3) {
      let msg = res.data.msg;
      let arr = msg.split(';');
      Vue.prototype.$my_message(arr, 'error', 5);
    } else {
      message.error(res.data.msg);
    }
    return Promise.reject(res.data || res.value);
  },
  error => {
    if (error.response.status == 401) {
      // let url = encodeURIComponent(`${utilSelf.origin}/lezao`);
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('lowCode-tenantId');
      // window.location.href = `${utilSelf.baseUrl}/mp-login/?app-code=code-design&return-url=${url}`;
    }
    Modal.confirm({
      title: '请求异常',
      content: JSON.stringify(error.message),
    });
    return Promise.reject(error);
  }
);

export function post(url, data) {
  return new Promise((resolve, reject) => {
    service({
      method: 'post',
      url,
      data,
    })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function get(url, data) {
  return new Promise((resolve, reject) => {
    service({
      method: 'get',
      url,
      params: data,
    })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export default service;
