/*
 * @Author: liupeixin liupx@nancal.com
 * @Date: 2022-05-26 16:56:01
 * @LastEditors: liupeixin liupx@nancal.com
 * @LastEditTime: 2022-05-26 17:15:11
 * @FilePath: /digital-process-ui/product-library/src/api/appList.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { get, post } from '@/services/request';
import { GenerateService } from '@/baseFramework/baseService';

const basic = process.env.VUE_APP_LEZAO_PERMISSION_HOST;

// 获取权限
export const getPermisonList = GenerateService(params => post(`${basic}/oauth/my-allow-resources-action`, params));
