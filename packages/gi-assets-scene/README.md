# gi-assets-scene Graphin 场景资产（大图场景 & 地图场景）

## 01 开发文档

`src/components`下默认约定为 GI 的组件资产，具体开发文档，参考：https://yuque.antfin.com/graphinsight/manual/xzdeb8

### 1.1 导出文件规范

GI 的业务资产包中对于导出文件有一个规范要求，即在`src/index.tsx`中，组件资产必须挂载在`components`下。

```jsx |  pure
export {
  components:Components,
  layouts:xxx,  // 未来如果有自定义元素的资产，也可以挂载上去
  elements:xxx  // 未来如果有自定义布局的资产，也可以挂载上去
  XXXStudio:XXXGraphStduio, // 这个是业务特有的 Studio
}
```

## 02 测试文档

每个组件中，我们新增`index.md`文件，我们采用`npm run docs`命令，可以使用 [dumi](https://d.umijs.org/) 渲染出来。可以参考`src/components/MyComponent/index.md`

### 2.1 使用说明

```tsx | pure
<TestSDK asset={asset} />
```

### 2.2 接口类型说明

```tsx | pure
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

### 2.3 组件类型说明

- GI_CONTAINER: 容器组件
  - GICC 普通容器组件
  - GICC_MENU 右键菜单的容器组件
  - GICC_LAYOUT 页面布局组件
- GI_CONTAINER_INDEX 原子组件
  - GIAC 普通原子组件
  - GIAC_CONTENT 可做内容的原子组件
  - GIAC_MENU 可做菜单的原子组件

## 03 部署流程

### 3.1 打包产物

```bash
npm run build  // 本地执行产生es/ lib/ dist/ 文件
npm publish --tag beta // 使用tnpm发布到内部npm仓库，如果第一次发布，需要tnpm login 登陆
```

### 3.2 CDN 同步

访问雨燕仓库：https://yuyan.antfin-inc.com/lib/version?name=%40alipay%2Fgeamaker-graphstudio
点击同步，进行包的同步，未发布可以点击发布，这样就可以使得 GrapStudio 的产物同步到 CDN 上
