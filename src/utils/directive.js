import Vue from 'vue';

Vue.directive('throttle', {
  bind: (el, binding) => {
    let throttleTime = binding.value; // 防抖时间
    if (!throttleTime) {
      // 用户若不设置防抖时间，则默认2s
      throttleTime = 2000;
    }
    let cbFun;
    el.addEventListener(
      'click',
      event => {
        if (!cbFun) {
          // 第一次执行
          cbFun = setTimeout(() => {
            cbFun = null;
          }, throttleTime);
        } else {
          event && event.stopImmediatePropagation();
        }
      },
      true
    );
  },
});
Vue.directive('tooltip', {
  // 指令所在组件的 VNode 及其子 VNode 全部更新后调用
  componentUpdated(el) {
    /* 第1步：先要创建一个容器`span`去获取文本的宽度 */
    // 获取当前元素的style
    const curStyle = window.getComputedStyle(el, '');
    // 创建一个容器来记录文字的width
    const textSpan = document.createElement('span');
    // 设置新容器的字体样式，确保与当前需要隐藏的样式相同
    textSpan.style.fontSize = curStyle.fontSize;
    textSpan.style.fontWeight = curStyle.fontWeight;
    textSpan.style.fontFamily = curStyle.fontFamily;
    // 将容器插入body，如果不插入，offsetWidth为0
    document.body.appendChild(textSpan);
    // 设置新容器的文字
    textSpan.innerHTML = el.innerText;
    // 如果字体元素大于当前元素，则需要隐藏
    /* 第2步：用获取到的宽跟`el`的宽进行对比，如果文本字体大于当前`el`元素的宽度，则需要title提示
     * 第3步：监听`el`的`onmouseenter`以及`onmouseleave`的鼠标移入移出事件
     */
    if (textSpan.offsetWidth > el.offsetWidth) {
      // 给当前元素设置超出隐藏
      el.style.overflow = 'hidden';
      el.style.textOverflow = 'ellipsis';
      el.style.whiteSpace = 'nowrap';
      // 鼠标移入
      el.onmouseenter = e => {
        if (el.innerText === '') return;
        /* 第4步：鼠标移入`onmouseenter`事件里需要处理title提示的显示 */
        // 创建浮层元素并设置样式
        const kxmTooltipDom = document.createElement('div');
        kxmTooltipDom.style.cssText = `
                display: inline-block;
                max-width: 400px;
                max-height: 400px;
                position: absolute;
                top: ${e.clientY + 5}px;
                left: ${e.clientX}px;
                padding: 10px;
                overflow: auto;
                font-size: 14px;
                color: #fff;
                background: rgba(0, 0 , 0, .6);
                border-radius: 5px;
                z-index: 19999
            `;
        // 设置id方便寻找
        kxmTooltipDom.setAttribute('id', 'kxm-tooltip');
        // 将浮层插入到body中
        document.body.appendChild(kxmTooltipDom);
        // 浮层中的文字
        document.getElementById('kxm-tooltip').innerHTML = el.innerText;
      };
      // 鼠标移出
      el.onmouseleave = () => {
        /* 第5步：鼠标移出`onmouseleave`需要移出title显示的元素 */
        // 找到浮层元素并移出
        const kxmTooltipDom = document.getElementById('kxm-tooltip');
        kxmTooltipDom && document.body.removeChild(kxmTooltipDom);
      };
    }
    // 需要注意：更新完之后需要移除容器，不然body里会多一个span元素内容
    document.body.removeChild(textSpan);
  },
  // 指令与元素解绑时
  unbind() {
    /* 第6步：解绑移除浮层元素 */
    // 找到浮层元素并移除
    const kxmTooltipDom = document.getElementById('kxm-tooltip');
    kxmTooltipDom && document.body.removeChild(kxmTooltipDom);
  },
});
