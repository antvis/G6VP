import { createFromIconfontCN } from '@ant-design/icons';

// https://github.com/ant-design/ant-design-icons/blob/master/packages/icons-react/src/components/IconFont.tsx
const Icon = createFromIconfontCN({
  // 资源地址：https://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.20&manage_type=myprojects&projectId=3381398&keyword=&project_type=&page=
  scriptUrl: 'https://at.alicdn.com/t/a/font_3381398_s877qsmwf1.js', // 在 iconfont.cn 上生成  `${window['GI_PUBLIC_PATH']}libs/font.js`, //
});

export default Icon;
