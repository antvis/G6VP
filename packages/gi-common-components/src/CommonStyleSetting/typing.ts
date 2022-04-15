export interface ItemConfig {
  id: string;
  name: string;
  props: {
    size: number;
    color: string;
    label: string[];
    [key: string]: any;
  };
  expressions?: {
    name: string;
    operator: string;
    value: string | number;
  }[];
  groupName: string;
}
