import type { Speed, TimeWindowType } from './type';

export const timeWindowList: { label: string; value: TimeWindowType }[] = [
  { label: '移动时间窗口', value: 'moveTime' },
  { label: '累积时间窗口', value: 'cumulativeTime' },
];

export const playbackSpeedList: { label: string; value: Speed }[] = [
  { label: '1x', value: 1 },
  { label: '1.5x', value: 1.5 },
  { label: '2x', value: 2 },
];
