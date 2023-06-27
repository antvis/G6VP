import $i18n from '../i18n';
export const getOperatorList = (type: 'string' | 'number' | 'boolean' | 'unknown') => {
  const base = [
    { label: $i18n.get({ id: 'common-components.src.GroupContainer.utils.Equal', dm: '等于' }), value: 'eql' },
    { label: $i18n.get({ id: 'common-components.src.GroupContainer.utils.NotEqual', dm: '不等于' }), value: 'not-eql' },
  ];

  const str = [
    { label: $i18n.get({ id: 'common-components.src.GroupContainer.utils.Include', dm: '包含' }), value: 'contain' },
    {
      label: $i18n.get({ id: 'common-components.src.GroupContainer.utils.NotIncluded', dm: '不包含' }),
      value: 'not-contain',
    },
  ];

  const num = [
    { label: $i18n.get({ id: 'common-components.src.GroupContainer.utils.Greater', dm: '大于' }), value: 'gt' },
    {
      label: $i18n.get({ id: 'common-components.src.GroupContainer.utils.GreaterThanOrEqual', dm: '大于等于' }),
      value: 'gte',
    },
    { label: $i18n.get({ id: 'common-components.src.GroupContainer.utils.Less', dm: '小于' }), value: 'lt' },
    {
      label: $i18n.get({ id: 'common-components.src.GroupContainer.utils.LessThanOrEqual', dm: '小于等于' }),
      value: 'lte',
    },
  ];

  if (type === 'string') {
    return [...base, ...str];
  } else if (type === 'number') {
    return [...base, ...num];
  } else if (type === 'boolean') {
    return base;
  }

  return [...base, ...str, ...num];
};
