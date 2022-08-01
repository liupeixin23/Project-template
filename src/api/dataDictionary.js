/*
 * @Author: liupeixin liupx@nancal.com
 * @Date: 2022-06-08 11:02:29
 * @LastEditors: liupeixin liupx@nancal.com
 * @LastEditTime: 2022-06-27 16:31:25
 * @FilePath: /digital-process-ui/personal-work/src/api/dataDictionary.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 数据字段下拉选项 & 公用接口
import { post } from '@/services/request';
import { GenerateService } from '@/baseFramework/baseService';
const lezao = process.env.VUE_APP_LEZAO_HOST;

// 字典接口
export const getSecretLevel = GenerateService(params => post(`${lezao}/lezaoDictionaries/getMoreDictEntryGroup`, params));
