import { message } from 'ant-vue-nancal';
import router from '@/router/index';
import { of, switchMap } from 'rxjs';

export default class BaseService {
  constructor(router, store) {
    this.router = router;
    this.store = store;
  }
}

export const GenerateService = api => {
  return params => {
    return of(0).pipe(switchMap(() => api(params)));
  };
};
