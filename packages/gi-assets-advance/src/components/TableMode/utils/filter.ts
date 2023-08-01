import { get } from '@antv/util';

export const getCurrentSortMethod = (fieldName, sortParams) => {
  return (
    get(
      (sortParams || []).filter(param => param.sortFieldId === fieldName),
      '[0].sortMethod',
      'NONE',
    ) || 'NONE'
  );
};

export const hasFilterParams = (fieldName, filterParams) => {
  return !!(filterParams || []).filter(param => param.filterKey === fieldName && param.filteredValues?.length).length;
};

/**
 *
 * @param fieldName
 * @param filterParams
 * @returns
 */
export const getCurrentFilterParams = (fieldName, filterParams) => {
  return (filterParams || [])
    .filter(param => param.filterKey === fieldName && param.filteredValues?.length)
    .map(param => param.filteredValues)
    .flat();
};

export const convertToObject = values => {
  const initData = {};

  values.forEach(val => {
    initData[val] = true;
  });

  return initData;
};
