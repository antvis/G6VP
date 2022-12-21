## My Custom Server 我的自定义服务包

### 01. 本地启动 HTTPServer 静态资源托管服务

```bash
npm run server
```

### 02. 编译 `src/services` ，生成 `dist` 文件

```bash
npm run build:umd:watch
```

### 03. 访问 G6VP 官网，添加引擎包

- 访问：https://graphinsight.antgroup.com/#/assets
- tnpm 名：my-custom-server
- 版本号：0.0.1
- UMD 名：MY_CUSTOM_SERVER
- CDN 地址：http://127.0.0.1:9527/index.min.js

### 04. 启动引擎包

- 打开「数据/上传」
- 点击确定
