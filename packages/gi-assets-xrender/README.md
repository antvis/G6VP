# GraphInsight Xrender Asset

## 使用说明

```tsx | pure
<TestSDK asset={asset} />
```

## 接口类型说明

```tsx
export interface TestSDKProps {
  /** Component 组件实例 **/
  asset: {
    component: React.FunctionComponent | React.Component;
    info: {
      id: string;
      name: string;
      type: 'GI_CONTAINER' | 'GI_CONTAINER_INDEX';
    };
    registerMeta: (context: { data: any; services: any[]; GI_CONTAINER_INDEXS: string[]; keys: string[] }) => any;
  };
  /** Component 组件类型 */
  type?: 'GICC' | 'GICC_MENU' | 'GIAC' | 'GIAC_CONTENT' | 'GIAC_MENU';
  /** 自定义数据服务 */
  services: {
    id: string;
    service: () => Promise<any>;
  }[];
}
```

## 组件类型

- GI_CONTAINER: 容器组件
  - GICC 普通容器组件
  - GICC_MENU 右键菜单的容器组件
- GI_CONTAINER_INDEX 原子组件
  - GIAC 普通原子组件
  - GIAC_CONTENT 可做内容的原子组件
  - GIAC_MENU 可做菜单的原子组件
