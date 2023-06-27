import type { Speed, TimeWindowType } from '../../types';
import $i18n from '../../../i18n';

export const timeWindowList: { label: string; value: TimeWindowType }[] = [
  {
    label: $i18n.get({ id: 'scene.control.animation.constants.MovingTimeWindow', dm: '移动时间窗口' }),
    value: 'moveTime',
  },
  {
    label: $i18n.get({ id: 'scene.control.animation.constants.CumulativeTimeWindow', dm: '累积时间窗口' }),
    value: 'cumulativeTime',
  },
];

export const playbackSpeedList: { label: string; value: Speed }[] = [
  { label: '1x', value: 1 },
  { label: '1.5x', value: 1.5 },
  { label: '2x', value: 2 },
];
