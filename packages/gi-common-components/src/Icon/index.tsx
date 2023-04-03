import { createFromIconfontCN } from '@ant-design/icons';

// https://github.com/ant-design/ant-design-icons/blob/master/packages/icons-react/src/components/IconFont.tsx
const Icon:any = createFromIconfontCN({
  // 资源地址：https://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.20&manage_type=myprojects&projectId=3381398&keyword=&project_type=&page=
  scriptUrl: 'https://at.alicdn.com/t/font_3381398_5hpi569akv7.js', // 在 iconfont.cn 上生成  `${window['GI_PUBLIC_PATH']}libs/font.js`, //
});

export default Icon;
