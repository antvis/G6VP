export const getOperatorList = (type: 'string' | 'number' | 'boolean' | 'unknown') => {
  const base = [
    { label: '等于', value: 'eql' },
    { label: '不等于', value: 'not-eql' },
  ];

  const str = [
    { label: '包含', value: 'contain' },
    { label: '不包含', value: 'not-contain' },
  ];

  const num = [
    { label: '大于', value: 'gt' },
    { label: '大于等于', value: 'gte' },
    { label: '小于', value: 'lt' },
    { label: '小于等于', value: 'lte' },
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
