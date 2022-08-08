export interface ContainerProps {
  placement: 'LT' | 'LB' | 'RT' | 'RB';
  offset: number[];
  width: string;
  height: string;
  defaultVisible: boolean;
}
