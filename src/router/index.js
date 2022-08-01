/*
 * @Author: liupeixin liupx@nancal.com
 * @Date: 2022-05-20 15:16:15
 * @LastEditors: liupeixin liupx@nancal.com
 * @LastEditTime: 2022-05-25 10:43:00
 * @FilePath: /digital-process-ui/product-library/src/router/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '../layout/layout.vue';

// 解决导航栏或者底部导航tabBar中的vue-router在3.0版本以上频繁点击菜单报错的问题。
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Layout,
    children: [
      {
        path: '/personalwork',
        name: 'personalwork',
        component: () => import('@/views/home'),
        children: [],
      },
    ],
  },
];
export const importRouter = [];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [...routes],
});

export default router;
export { routes };
