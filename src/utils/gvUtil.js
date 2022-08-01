// eslint-disable-next-line max-classes-per-file
import Vue from 'vue';
import { message } from 'ant-vue-nancal';
import request from '@/services/request';
import _cloneDeep from 'lodash.clonedeep';
import { defaultsDeep } from 'lodash';

const EventBus = new Vue();
export const gvUtil = {
  http: request,
  mode: process.env.VUE_APP_ENV,
  origin: window.location.origin,
  baseUrl: process.env.VUE_APP_ENV === 'dev' ? process.env.VUE_APP_BASE_API : window.location.origin,
  success(msg, duration) {
    message.success(msg || '操作成功！', duration || 0.5);
  },
  warning(msg, duration) {
    message.warning(msg || '操作成功！', duration || 0.5);
  },
  error(msg, duration) {
    message.error(msg || '操作失败！', duration || 0.5);
  },
  getStorage(key) {
    if (key) {
      return JSON.parse(localStorage.getItem(key));
    } else {
      return null;
    }
  },
  setStorage(key, val) {
    if (key && val) {
      localStorage.setItem(key, JSON.stringify(val));
    }
  },
  // 去除千分位中的‘，’
  delcommafy: function delcommafy(num) {
    num = num.toString();
    num = num.replace(/,/gi, '');
    return num;
  },
  // 数字加千分符
  comdify: function comdify(n) {
    let re = /\d{1,3}(?=(\d{3})+$)/g;
    let n1 = n.replace(/^(-?\d+)((\.\d+)?)$/, function (s, s1, s2) {
      return s1.replace(re, '$&,') + s2;
    });
    return n1;
  },
  removeStorage(key) {
    if (key) {
      localStorage.removeItem(key);
    }
  },
  toLogin() {
    let url = encodeURIComponent(`${this.origin}/code-design`);
    window.location.href = `${this.baseUrl}/mp-login/?app-code=code-design&return-url=${url}`;
  },
  setVuexIndex(arr) {
    let indexJs = '';
    let importModel = '';
    let modules = '';
    let dependentFile = `
        import { createStore, Store } from 'vuex'
      `;
    arr.forEach(item => {
      importModel += `
          import ${item.name} from './models/${item.name}.js'
        `;
      modules += `${item.name},\n`;
    });
    let storeCount = `
      let state = {}
      let modules = {
        ${modules}
      }`;
    let defaultTo = `
        let store = createStore({
          state,
          modules,
        })
        export default store
      `;
    indexJs = `
        ${dependentFile}
        ${importModel}
        ${storeCount}
        ${defaultTo}
      `;
    return indexJs;
  },
  _cloneDeep: _cloneDeep,
  _defaultsDeep: defaultsDeep,
  // antd树节点通过key 获取树节点信息
  recursiveFilter(tree, keys) {
    let data = tree.filter(item => item.id == keys);
    if (data.length != 0) {
      // this.treeInfo = data[0];
      return data[0];
    } else {
      tree.map(item => {
        if (item.children) {
          //递归循环
          this.recursiveFilter(item.children, keys);
        }
      });
    }
    return data;
  },
};

/**
 * 处理q、qMap和r、rMap
 * @class
 */
export class DisposeApi {
  constructor(item) {
    this.q = {};
    this.qStr = '';
    this.qMap = [];
    this.qMapStr = '';
    this.r = {};
    this.rStr = '';
    this.rMap = [];
    this.rMapStr = '';
    this.dispose(item);
  }

  dispose(item) {
    this.disposeRequest(item);
    this.disposeResponse(item);
  }

  // 处理request
  disposeRequest(item) {
    const REG = /\{(.+?)\}/g;
    // 处理 interfaceUrl
    let requestUrl = item.interfaceUrl.match(REG) || [];
    requestUrl.forEach(e => {
      e = e.substring(1, e.length - 1);
      this.qMap.push({ value: e, path: 'interfaceUrl' });
      this.q[e] = '';
    });
    // 处理 requestBody
    let requestBody = item.requestBody?.root?.properties || {};
    let required = item.requestBody?.root?.required || [];
    // 此处可深层处理query { map, value }
    let { map } = this.disposeNesting(requestBody, null, 'requestBody', null, required);
    // 因德国要求只取第一层数据
    Object.keys(requestBody).forEach(key => {
      if (['pageNo', 'pageSize'].includes(key)) {
        this.q[key] = key == 'pageNo' ? 1 : 10;
      } else {
        this.q[key] = requestBody[key].default ? requestBody[key].default : this.disposeDefaultVal(requestBody[key].type);
      }
    });
    // this.q = Object.assign(this.q, value);
    this.qMap.push(...map);

    // 处理 requestQuery
    let requestQuery = item.requestQuery || [];
    requestQuery.forEach(e => {
      this.qMap.push({
        value: e.name,
        path: 'requestQuery',
        type: e.type,
        required: e.required,
        default: e.default,
        description: e.description,
      });

      this.q[e.name] = this.disposeDefaultVal(e.type);
    });

    // 处理 requestHeader
    let requestHeader = item.requestHeader || [];
    requestHeader.forEach(e => {
      this.qMap.push({ value: JSON.stringify(e.name), path: 'requestHeader' });

      this.q[e.name] = e.deafult;
    });
    // qMap转字符串
    this.qStr = JSON.stringify(this.q);
    this.qMapStr = JSON.stringify(this.qMap);
  }

  // 处理response
  disposeResponse(item) {
    // 处理 responseBody
    let responseBody = item.responseBody?.root?.properties || {};
    Object.keys(responseBody).forEach(e => {
      if (e === 'code') {
        this.r[e] = null;
      } else {
        this.r[e] = this.disposeDefaultVal(responseBody[e].type);
      }
    });

    this.rStr = JSON.stringify(this.r);
    let { map } = this.disposeNesting(responseBody);
    this.rMap = map;
    this.rMapStr = JSON.stringify(this.rMap);
  }

  // 处理默认值情况
  disposeDefaultVal(defaultType) {
    if (defaultType === 'string') {
      return '';
    }
    if (['number', 'integer', 'float', 'double'].includes(defaultType)) {
      return 0;
    }
    if (defaultType === 'boolean') {
      return false;
    }
    if (defaultType === 'array') {
      return [];
    }
    if (defaultType === 'object') {
      return {};
    }
    return null;
  }

  // 处理嵌套
  disposeNesting(body, parentType = 'object', path = '', type, required = []) {
    let map = [];
    let value = {};
    // 外层是数组的情况
    if (type === 'items') {
      // items如果还是数组
      if (body.type === 'array' && body.items) {
        let { map: childMap, value: childVal } = this.disposeNesting(body.items, body.type, path ? `${path}.items` : `items`, 'items');
        return { map: childMap, value: [childVal] };
      }
      // items是对象
      if (body.type === 'object' && body.properties) {
        return this.disposeNesting(body.properties, body.type, path ? `${path}.items` : `items`);
      }
      // items是普通数据类型
      return { map: [], value: this.disposeDefaultVal(body.type) };
    }
    Object.keys(body).forEach(key => {
      let children = [];
      let childrenValue = {};
      if (body[key].type === 'array' && body[key].items) {
        let { map: childMap, value: childVal } = this.disposeNesting(body[key].items, body[key].type, path ? `${path}.${key}` : `${key}`, 'items');
        children = childMap;
        childrenValue = [childVal];
      } else if (body[key].type === 'object' && body[key].properties) {
        let { map: childMap, value: childVal } = this.disposeNesting(body[key].properties, body[key].type, path ? `${path}.${key}` : `${key}`);
        children = childMap;
        childrenValue = childVal;
      }
      // 处理value
      if (['pageNo', 'pageSize'].includes(key)) {
        value[key] = key == 'pageNo' ? 1 : 10;
      } else {
        value[key] = ['array', 'object'].includes(body[key].type) ? childrenValue : body[key].default ? body[key].default : this.disposeDefaultVal(body[key].type);
      }
      // 处理map
      map.push({
        value: key,
        path: path ? `${path}.${key}` : `${key}`,
        type: body[key].type,
        description: body[key].title || body[key].description,
        default: body[key].default,
        parentType,
        required: required.includes(key),
        children,
      });
    });
    return { map, value };
  }
}

export default {
  install(Vue) {
    Vue.prototype.gvUtil = gvUtil;
    Vue.prototype.$event = EventBus;
    Vue.gvUtil = gvUtil;
  },
};
