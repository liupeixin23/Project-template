/*
 * @Author: liupeixin liupx@nancal.com
 * @Date: 2022-05-20 15:16:15
 * @LastEditors: liupeixin liupx@nancal.com
 * @LastEditTime: 2022-08-01 10:24:42
 * @FilePath: /项目模板/src/main.js
 * @Description: 
 * 
 * Copyright (c) 2022 by liupeixin liupx@nancal.com, All Rights Reserved. 
 */
import Vue from 'vue';
import App from './App.vue';
import router from '@/permission.js';
import store from './store';
import Antd from 'ant-vue-nancal';
import Message from '@/components/alert/index.js';
Vue.prototype.$my_message = Message.install;

import '@/assets/styles/common.less'; //公共样式变量
import '@/assets/styles/reset.css'; // 统一样式
import 'ant-vue-nancal/dist/antd.css';
import 'n-class-help/dist/style/index.css';
import '@/assets/iconfont/iconfont.css';
import '@/assets/iconfont/iconfont.js';
import 'tailwindcss/tailwind.css';
import IconSvg from '@/components/icon';

/**替换组件库中的时间插件 */
import * as dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

import util from '@/utils/util.js'; // 工具类

import '@/utils/directive.js';
Vue.use(Antd);
Vue.use(util); // 工具类
Vue.component('IconSvg', IconSvg);
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
