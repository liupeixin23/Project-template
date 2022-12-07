import { includes, ifElse, split, pipe, concat, clone, pathOr, mergeDeepRight, tryCatch, head, equals, anyPass, has } from 'ramda'; // assocPath is
import Vue from 'vue';

const isRegExp = pipe(
  tryCatch(eval, () => false),
  ifElse(
    regInstance => regInstance instanceof RegExp,
    reg => reg,
    () => false
  )
);
// const isArray = Array.isArray;
const isArray = array => Object.prototype.toString.call(array) === '[object Array]';
const isJson = jsonObj => Object.prototype.toString.call(jsonObj) === '[object Object]';
const isMap = map => Object.prototype.toString.call(map) === '[object Map]';
const isWeakMap = weakMap => Object.prototype.toString.call(weakMap) === '[object WeakMap]';
const isNumber = number => Object.prototype.toString.call(number) == '[object Number]';
const isString = string => Object.prototype.toString.call(string) == '[object String]';
const isBoolean = boolean => Object.prototype.toString.call(boolean) == '[object Boolean]';
const isSet = set => Object.prototype.toString.call(set) == '[object Set]';
const isWeakSet = weakSet => Object.prototype.toString.call(isWeakSet) == '[object WeakSet]';

const splitForDot = split('.');
const isincludeForDot = includes('.');
const isJsonOrMap = anyPass([isJson, isMap, isWeakMap]);

const keyArrayForConfig = concat(['config']);

const makePayLoadKeyForData = ifElse(
  isArray,
  keyPath => keyPath,
  ifElse(isincludeForDot, splitForDot, key => [key])
);

const makePayLoadKeyForConfig = ifElse(
  isArray,
  ifElse(
    pipe(head, equals('config')),
    args => args,
    args => ['config', ...args]
  ),
  ifElse(isincludeForDot, pipe(splitForDot, keyArrayForConfig), key => ['config', key])
);

function lookup(key, target) {
  let keyList = '';
  if (isincludeForDot(key)) {
    keyList = splitForDot(key);
  }
  if (isArray(keyList)) {
    let o = keyList.reduce((preObj, curKey) => {
      preObj = preObj[curKey];
      return preObj;
    }, target);
    return o;
  }
  return target[key];
}

function assocPathPlus(obj, keyPath, value) {
  const indexOrKey = keyPath.shift();
  const deep = keyPath.length;
  const isArrayObj = isArray(obj);

  function createSetValue(deep) {
    if (deep == 0) {
      return () => value;
    } else {
      return key => assocPathPlus(obj[key], Array.from(keyPath), value);
    }
  }

  /*
    数组处理逻辑
  */
  function handleArray() {
    if (indexOrKey == '*') {
      for (let index = 0; index < obj.length; index++) {
        obj[index] = setValue(index);
      }
      return obj;
    }
    // 支持正则-2022-03-05 13:19
    let regExp = isRegExp(indexOrKey);
    if (regExp) {
      for (let index = 0; index < obj.length; index++) {
        if (regExp.test(index)) {
          regExp.lastIndex = 0;
          obj[index] = setValue(index);
        }
      }
      return obj;
    }

    if (Number.isInteger(indexOrKey * 1)) {
      obj[indexOrKey] = setValue(indexOrKey);
      return obj;
    }
  }

  /*
      对象处理逻辑
    */
  function handleObject() {
    if (indexOrKey == '*') {
      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) obj[key] = setValue(key);
      }
      return obj;
    }

    // 支持正则-2022-03-05 13:19
    let regExp = isRegExp(indexOrKey);
    if (regExp) {
      for (const key in obj) {
        if (regExp.test(key)) {
          regExp.lastIndex = 0;
          obj[key] = setValue(key);
        }
      }
      return obj;
    }

    if (indexOrKey in obj) {
      obj[indexOrKey] = setValue(indexOrKey);
    } else {
      let data = setValue(indexOrKey);
      Vue.set(obj, indexOrKey, data);
    }
    return obj;
  }

  const setValue = createSetValue(deep);

  return isArrayObj ? handleArray() : handleObject();
}

// state, rootState , dispatch, commit, getters, rootGetters
const baseActions = {
  fromTo(sonStore, payload) {
    if (!payload || !payload.from || !payload.to) return;
    let newData = clone(lookup(payload.from, sonStore.rootState));
    const keyList = splitForDot(payload.to);
    const namesapce = keyList.shift();
    // TODO 需要全局的dispatch and 需要拆解key
    if (newData) {
      this.commit(namesapce + '/setData', {
        key: keyList,
        data: newData,
      });
    }
  },
  resetPlainData(sonStore, payload) {
    if (!payload || !payload.key) return;

    let oldObj = lookup(payload.key, sonStore.state);
    let newObj = {};

    for (const key in oldObj) {
      if (isNumber(oldObj[key])) {
        newObj[key] = 0;
        continue;
      }

      if (isString(oldObj[key])) {
        newObj[key] = '';
        continue;
      }

      if (isJson(oldObj[key])) {
        newObj[key] = {};
        continue;
      }

      if (isArray(oldObj[key])) {
        newObj[key] = [];
        continue;
      }

      if (isBoolean(oldObj[key])) {
        newObj[key] = false;
        continue;
      }

      if (isMap(oldObj[key])) {
        newObj[key] = new Map();
        continue;
      }

      if (isWeakMap(oldObj[key])) {
        newObj[key] = new WeakMap();
        continue;
      }

      if (isSet(oldObj[key])) {
        newObj[key] = new Set();
        continue;
      }

      if (isWeakSet(oldObj[key])) {
        newObj[key] = new WeakSet();
        continue;
      }
    }

    let defaultObj = payload.default;
    for (const key in defaultObj) {
      newObj[key] = defaultObj[key];
    }

    sonStore.dispatch('setData', {
      key: payload.key,
      data: newObj,
    });
  },
  setRoot(store, payload) {
    console.log('setRoot-------------->');
    if (!payload || !payload.data || !payload.key) return;

    if (payload.isMerge) {
      store.commit('setData', payload);
    } else {
      store.commit('setData', { data: payload });
    }
  },
  setObject: (sonStore, payload = {}) => {
    let dispatch = sonStore.dispatch;
    console.log('setObject--------->');
    if (!isJsonOrMap(payload)) throw '请传入一个 json对象 or Map对象';

    if (isMap(payload) || isWeakMap(payload)) {
      payload.forEach((data, key) => {
        dispatch('setData', { key, data });
      });
    } else {
      for (const key in payload) {
        if (Object.hasOwnProperty.call(payload, key)) {
          const data = payload[key];
          dispatch('setData', { key, data });
        }
      }
    }
  },
  // 初始化执行的action
  setData: ({ commit }, payload = {}) => {
    payload.key = makePayLoadKeyForData(payload.key);
    commit('setData', payload);
  },
  setConfig: ({ commit }, payload = {}) => {
    payload.key = makePayLoadKeyForConfig(payload.key);
    commit('setData', payload);
  },
  // 下拉加载后执行的action
  /**
   * @purpose 追加数据
   *
   * @todo
   *    1. TODO 不进行深拷贝会报错(不可以修改store的值在mutations外)
   *    2. 性能待测 2020-02-20 21:01 @miles_fk
   *    3. isMerge 是否需要 ????？
   *    4. restData 是否需要 ????？
   *    5. JSON.stringify      JSON.parse 优化数组不能用
   *
   */
  pushData: ({ commit, state }, payload) => {
    let list = [];

    const keyPathList = makePayLoadKeyForData(payload.key);
    // TODO 待优化  JSON.stringify  - 2020-04-30 19:00
    // JSON.parse(JSON.stringify(this.maintainForm));
    list = clone(pathOr([], keyPathList, state));
    payload.data.forEach(item => {
      list.push(item);
    });

    payload.key = keyPathList;
    commit('setData', { key: payload.key, data: list });
  },
};

// R.assocPath(['a', 'b', 'c'], 42, {a: {b: {c: 0}}}); //=> {a: {b: {c: 42}}}
// 传入的数据也要判断一下，不应该是一个数组或字符串
const baseMutations = {
  setData: (state, payload) => {
    // eslint-disable-next-line prefer-const
    let { key, data, isMerge = false } = payload;

    // 深度复制 2022-03-20 18:20
    // 会造成在 watch这个属性时，同时setData这个属性 而造成死循环
    // data = clone(data);
    if (!key && state) {
      // 如果不需要 merge 则删除老数据 [2022-07-06 22:27]
      if (!isMerge) {
        for (const oldKey in state) {
          if (!has(oldKey, data)) {
            delete state[oldKey];
          }
        }
      }

      // 添加新数据
      for (const newKey in data) {
        Vue.set(state, newKey, data[newKey]);
      }
      return;
    }

    const [keyType, ...restKeyList] = key;

    // mergeDeepRight({a:100,b:200},{a:300})  {"a": 300, "b": 200}
    if (isMerge) {
      data = mergeDeepRight(state[keyType], data);
      Vue.set(state, keyType, data);
      return;
    }

    if (restKeyList.length > 0) {
      if (!has(keyType, state)) {
        Vue.set(state, keyType, {});
      }

      state[keyType] = assocPathPlus(state[keyType], restKeyList, data);
    } else {
      if (keyType in state) {
        state[keyType] = data;
      } else {
        Vue.set(state, keyType, data);
      }
    }
  },
};

export { baseActions, baseMutations };
