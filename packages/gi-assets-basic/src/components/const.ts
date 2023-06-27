import $i18n from '../i18n';
export const PLACEMENT_OPTIONS = [
  {
    value: 'LT',
    label: $i18n.get({ id: 'basic.src.components.const.UpperLeft', dm: '左上' }),
  },
  {
    value: 'RT',
    label: $i18n.get({ id: 'basic.src.components.const.UpperRight', dm: '右上' }),
  },
  {
    value: 'LB',
    label: $i18n.get({ id: 'basic.src.components.const.LowerLeft', dm: '左下' }),
  },
  {
    value: 'RB',
    label: $i18n.get({ id: 'basic.src.components.const.LowerRight', dm: '右下' }),
  },
];

export const DIRECTION_OPTIONS = [
  {
    label: $i18n.get({ id: 'basic.src.components.const.HorizontalDisplay', dm: '水平展示' }),
    value: 'horizontal',
  },
  {
    label: $i18n.get({ id: 'basic.src.components.const.VerticalDisplay', dm: '纵向展示' }),
    value: 'vertical',
  },
];
