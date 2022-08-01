/**
 * 函数防抖封装
 * @param {*} fn 回调函数
 * @param {*} wait  时间
 */
export const debounce = (fn, wait = 1000) => {
  let timer;
  return function () {
    let context = this;
    let args = arguments;
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  };
};
