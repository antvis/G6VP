import { isEmpty } from 'lodash-es';
import type { Selection } from '../panel/types';

export const getKeySteps = (timeLine: string[], selection: Selection) => {
  if (isEmpty(timeLine)) {
    return {
      startKey: 0,
      endKey: 0,
      steps: 1,
    };
  }

  let startKey = 0;
  let endKey = 0;
  for (let i = 0; i < timeLine.length; i++) {
    if (timeLine[i] === selection[0]) {
      startKey = i;
    }
    if (timeLine[i] === selection[1]) {
      endKey = i;
    }
  }

  const steps = endKey - startKey;

  return { startKey, endKey, steps };
};

export const getTimeInterval = (
  timeLine: string[],
  selection: Selection,
  timeWindowType: 'moveTime' | 'cumulativeTime' = 'moveTime',
  playback: boolean = false,
): [string, string] | undefined => {
  if (timeLine.length === 0) {
    return undefined;
  }

  const { startKey, endKey, steps: newSteps } = getKeySteps(timeLine, selection);
  const lastKey = timeLine.length - 1;

  // 到达尾部
  if (endKey === lastKey) {
    const start = timeWindowType === 'moveTime' ? timeLine[0] : timeLine[startKey];
    const end = timeWindowType === 'moveTime' ? timeLine[newSteps] : timeLine[startKey + 1];
    return [start, end];
  }

  // 移动时间窗口
  if (timeWindowType === 'moveTime') {
    if (playback) {
      const start = timeLine[0];
      const end = timeLine[newSteps];
      return [start, end];
    }

    const start = timeLine[startKey + 1];
    const end = timeLine[endKey + 1];
    return [start, end];
  } else {
    // 累积时间窗口
    if (playback) {
      const start = timeLine[startKey];
      const end = timeLine[startKey + 1];
      return [start, end];
    }

    const start = timeLine[startKey];
    const end = timeLine[endKey + 1];
    return [start, end];
  }
};
