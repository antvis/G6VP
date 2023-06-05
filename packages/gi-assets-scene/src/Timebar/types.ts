export type TimeWindowType = 'moveTime' | 'cumulativeTime';

export type Speed = 1 | 1.5 | 2;

export type Aggregation = 'count' | 'max' | 'mean' | 'min' | 'sum' | 'median';

export type Selection = [string, string] | [number, number];

export type TimeGranularity = 'year' | 'quarter' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | number;

export type TimeFiled = `${'nodes' | 'edges'}:${string}`;
