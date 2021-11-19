// 色彩对
export type IColorPair = {
  primary: string; // 主色
  secondary: string; // 副色
};

export const COLORS: Array<IColorPair> = [
  // 蓝
  {
    primary: '#3D76DD',
    secondary: '#9AC5FF',
  },
  // 绿
  {
    primary: '#19A576',
    secondary: '#61DDAA',
  },
  // 灰
  {
    primary: '#65789B',
    secondary: '#B4C8ED',
  },
  // 黄
  {
    primary: '#D7A100',
    secondary: '#F6BD16',
  },
  // 茄
  {
    primary: '#5349E0',
    secondary: '#CCB0FF',
  },
  // 天
  {
    primary: '#5AB8DB',
    secondary: '#78D3F8',
  },
  // 葡
  {
    primary: '#7B48A1',
    secondary: '#EBB0FF',
  },
  // 土
  {
    primary: '#D77622',
    secondary: '#FFAB57',
  },
  // 翠
  {
    primary: '#008685',
    secondary: '#6FD8D6',
  },
  // 粉
  {
    primary: '#D37099',
    secondary: '#FFA6D0',
  },
];

export class ColorPicker {
  private index: number = 0;

  private mode: 'reverse' | 'common' = 'common'; // 正向选择、 逆向选择

  constructor(mode?: 'reverse' | 'common') {
    this.mode = mode ?? 'common';
    if (mode === 'reverse') this.index = COLORS.length - 1;
  }

  public pickColorPair() {
    const index = Math.abs(this.index % COLORS.length);
    const colorPair = COLORS[index];
    this.index += this.mode === 'common' ? 1 : -1;
    return colorPair;
  }
}
