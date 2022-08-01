export const materialType = [
  {
    label: '成品',
    value: 'ZFRT',
  },
  {
    label: '半成品',
    value: 'ZHLB',
  },
  {
    label: '零部件',
    value: 'ZRHL',
  },
  {
    label: '原辅料',
    value: 'ZROH',
  },
  {
    label: '生产工序物料',
    value: 'ZSGX',
  },
];

export const units = ['米', '厘米', '平方米', '立方米', '安', '毫安', '克', '千克', '公顷', '欧姆', '摄氏度', '伏', '个'];

export const plantStatusOptions = [
  {
    label: '启用',
    value: 'Y',
  },
  {
    label: '禁用',
    value: 'N',
  },
];

export const versions = [
  {
    label: '全部',
    value: 'N',
  },
  {
    label: '最新',
    value: 'Y',
  },
];

export function getLabelByValue(source, value) {
  for (const item of source) {
    if (value === item.value) {
      return item.label;
    }
  }
}

export const BomSelect = [
  {
    label: 'EBOM',
    value: 1,
  },
  {
    label: 'MBOM',
    value: 2,
  },
  {
    label: '工厂1',
    value: 3,
  },
  {
    label: '工厂2',
    value: 4,
  },
];

export const BomStatusSelect = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '工作中',
    value: 'working',
  },
  {
    label: '审核中',
    value: 'approving',
  },
  {
    label: '已发布',
    value: 'released',
  },
];

export const versionsTree = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '最新',
    value: 'Y',
  },
];
