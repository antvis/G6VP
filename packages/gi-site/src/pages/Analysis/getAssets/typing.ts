export interface TypeAssetInfo {
  id: 'string';
  type:
    | 'GI_CONTAINER_INDEX' //原子组件
    | 'GI_CONTAINER' // 容器组件
    | 'GICC'
    | 'GICC_MENU'
    | 'GIAC'
    | 'GIAC_CONTENT'
    | 'GIAC_MENU'
    | 'NODE'
    | 'EDGE'
    | 'LAYOUT';
  name: string;
  [key: string]: string;
}
