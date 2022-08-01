/*
 * @Author: liupeixin liupx@nancal.com
 * @Date: 2022-06-08 18:06:37
 * @LastEditors: liupeixin liupx@nancal.com
 * @LastEditTime: 2022-07-16 10:55:00
 * @FilePath: /digital-process-ui/personal-work/src/store/modules/dataDictionary.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { baseMutations } from '@/baseFramework/baseStore';
import { tap, firstValueFrom } from 'rxjs';

import { getSecretLevel } from '@/api/dataDictionary';

export default {
  namespaced: true,
  state: {
    selectForm: {},
  },
  mutations: {
    ...baseMutations,
    setDictionData(state, item) {
      state.selectForm[item.dictType] = item.dictList;
    },
  },
  actions: {
    //获取所有字典
    xGteAllDictionData({ commit }) {
      getSecretLevel({
        dictTypes: [
          'gte4Phase', // 工艺规程阶段下拉框数据
        ],
        appCodes: ['lz624-myworkspace', 'lz624-msgbom', 'lz624-library'],
      })
        .pipe(
          tap(({ data }) => {
            data.forEach(item => {
              commit('setDictionData', item);
            });
          })
        )
        .subscribe();
    },
  },
};
