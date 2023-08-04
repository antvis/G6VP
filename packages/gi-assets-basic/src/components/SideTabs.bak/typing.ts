export interface ContainerProps {
  // LB 左，RT 右，LT 上，RB 下
  placement: 'LT' | 'LB' | 'RT' | 'RB';
  offset: number[];
  width: string;
  height: string;
  defaultVisible: boolean;
}
