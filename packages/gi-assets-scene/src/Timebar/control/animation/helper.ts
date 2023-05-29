import { isEmpty } from 'lodash-es';
import type { Selection } from '../../types';

export const getKeySteps = (timebar: string[], selection: Selection) => {
  if (isEmpty(timebar)) {
    return {
      startKey: 0,
      endKey: 0,
      steps: 1,
    };
  }

  let startKey = 0;
  let endKey = 0;
  for (let i = 0; i < timebar.length; i++) {
    if (timebar[i] === selection[0]) {
      startKey = i;
    }
    if (timebar[i] === selection[1]) {
      endKey = i;
    }
  }

  const steps = endKey - startKey;

  return { startKey, endKey, steps };
};

export const getTimeInterval = (
  timebar: string[],
  selection: Selection,
  timeWindowType: 'moveTime' | 'cumulativeTime' = 'moveTime',
  playback: boolean = false,
): [string, string] | undefined => {
  if (timebar.length === 0) {
    return undefined;
  }

  const { startKey, endKey, steps: newSteps } = getKeySteps(timebar, selection);
  const lastKey = timebar.length - 1;

  // 到达尾部
  if (endKey === lastKey) {
    const start = timeWindowType === 'moveTime' ? timebar[0] : timebar[startKey];
    const end = timeWindowType === 'moveTime' ? timebar[newSteps] : timebar[startKey + 1];
    return [start, end];
  }

  // 移动时间窗口
  if (timeWindowType === 'moveTime') {
    if (playback) {
      const start = timebar[0];
      const end = timebar[newSteps];
      return [start, end];
    }

    const start = timebar[startKey + 1];
    const end = timebar[endKey + 1];
    return [start, end];
  } else {
    // 累积时间窗口
    if (playback) {
      const start = timebar[startKey];
      const end = timebar[startKey + 1];
      return [start, end];
    }

    const start = timebar[startKey];
    const end = timebar[endKey + 1];
    return [start, end];
  }
};
