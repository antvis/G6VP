export interface ContainerProps {
  placement: 'RT' | 'LT' | 'RB' | 'LB';
  offset: number[];
  width: number;
  height: number;
  defaultVisible: boolean;
}
