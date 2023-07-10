## 在 HTML 中 消费 GI_SDK_APP

- 加载 JS 脚本，全局变量为 GI_SDK_APP

```html
<!--- REACT ENV-->
<script src="https://gw.alipayobjects.com/os/lib/babel/standalone/7.19.2/babel.min.js"></script>
<!--- REACT DEPENDENCIES-->
<script src="https://gw.alipayobjects.com/os/lib/react/17.0.2/umd/react.production.min.js"></script>
<script src="https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.production.min.js"></script>
<!--- GI_SDK_APP -->
<script src="https://gw.alipayobjects.com/os/lib/antv/gi-sdk-app/1.0.0/dist/index.min.js"></script>
```

- 加载 CSS 脚本

```html
<link rel="stylesheet" href="https://gw.alipayobjects.com/os/lib/antv/gi-sdk-app/1.0.0/dist/index.css" />
```

- 运行脚本，渲染得到应用

其中 `GI_EXPORT_CONFIG.json` 都是 [Insight](https://insight.antv.antgroup.com) 站点导出的配置，如下方代码所示，我们在本地构建了一个 Mock Server ，推荐用户自己构建服务，托管自己的站点应用

```html
<body>
<div id="root"></div>
<script type="text/babel">
  const GraphApp = () => {
    const service = async () => {
      const config = await fetch('./GI_EXPORT_CONFIG.json').then(res => res.json())
      return {
        data: config,
        success: true,
      }
    }
    const { default: GI_SDK_APP } = window.GI_SDK_APP;

    return <div style={{ height: "100vh" }}>
      <GI_SDK_APP id={'8e85de53-dcf3-492f-9786-c21554d07e8a'} service={service} />
    </div>
  }
  //@ts-ignore
  window.ReactDOM.render(<GraphApp />, document.getElementById("root"));
</script>
</body>
</html>
```

- 最终效果

可以在 g6vp 的仓库中, cd gi-sdk-app ,然后 `npm run build` ,然后双击 `index.html` 运行
