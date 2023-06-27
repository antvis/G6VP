import $i18n from '../i18n';
export const TIME_GRANULARITY_LIST = [
  { label: $i18n.get({ id: 'scene.src.Timebar.constant.Seconds', dm: '秒' }), value: 'second' },
  // { label: '分', value: 'minute' },
  // { label: '时', value: 'hour' },
  { label: $i18n.get({ id: 'scene.src.Timebar.constant.Days', dm: '天' }), value: 'day' },
  // { label: '周', value: 'week' },
  { label: $i18n.get({ id: 'scene.src.Timebar.constant.Month', dm: '月' }), value: 'month' },
  // { label: '季度', value: 'quarter' },
  { label: $i18n.get({ id: 'scene.src.Timebar.constant.Year', dm: '年' }), value: 'year' },
];
