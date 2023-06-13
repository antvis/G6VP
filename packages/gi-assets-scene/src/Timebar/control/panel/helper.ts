import dayjs from 'dayjs';
import { maxBy, minBy } from 'lodash-es';
import type { Selection, TimeGranularity } from '../../types';

export const formatXAxis = (data: string | number, format: string) => {
  if (dayjs(data, format).isValid()) {
    return dayjs(data).format(format);
  }
  return dayjs(data).format(format);
};

export const getFormatData = (data: Record<string, any>[], field: string, format: string) => {
  const newData = data
    .filter(item => !!item[field])
    .map(item => {
      return {
        ...item,
        [field]: formatXAxis(item[field], format),
      };
    })
    .sort(function (a, b) {
      return new Date(a[field]).getTime() - new Date(b[field]).getTime();
    });

  return newData;
};

export const getInitTimeRange = (times: string[]) => {
  const dataIndex = Math.ceil(times.length * 0.2);
  const timeRange: Selection = [times[0], times[dataIndex]];

  return timeRange;
};

export const getTimeInterval = (times: string[]): [string, string] | [number, number] => {
  const max = maxBy(times, function (item) {
    return new Date(item).getTime();
  })!;

  const min = minBy(times, function (item) {
    return new Date(item).getTime();
  })!;

  return [min, max];
};

export const getTimeFormat = (timeGranularity: TimeGranularity) => {
  switch (timeGranularity) {
    case 'year':
      return 'YYYY';
    case 'quarter':
    case 'month':
      return 'YYYY-MM';
    case 'week':
    case 'day':
      return 'YYYY-MM-DD';
    case 'hour':
      return 'YYYY-MM-DD HH';
    case 'minute':
      return 'YYYY-MM-DD HH:mm';
    case 'second':
    default:
      return 'YYYY-MM-DD HH:mm:ss';
  }
};
