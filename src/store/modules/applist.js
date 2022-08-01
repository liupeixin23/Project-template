/*
 * @Author: liupeixin liupx@nancal.com
 * @Date: 2022-05-26 16:55:58
 * @LastEditors: liupeixin liupx@nancal.com
 * @LastEditTime: 2022-06-03 23:10:31
 * @FilePath: /digital-process-ui/check-library/src/store/modules/appList.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { baseActions, baseMutations } from '@/baseFramework/baseStore';
import { getPermisonList } from '@/api/appList';
import { tap, firstValueFrom } from 'rxjs';

export default {
  namespaced: true,
  state: {
    appListPermission: [],
  },
  mutations: {
    ...baseMutations,
  },
  actions: {
    ...baseActions,
    xGetPermisonList({ dispatch }, params) {
      let $getPermisonList = getPermisonList(params).pipe(
        tap(res => {
          dispatch('setData', {
            key: 'appListPermission',
            data: res.data,
          });
        })
      );
      return firstValueFrom($getPermisonList);
    },
  },
};
