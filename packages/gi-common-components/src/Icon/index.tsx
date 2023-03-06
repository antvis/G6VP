import { createFromIconfontCN } from '@ant-design/icons';

const Icon = createFromIconfontCN({
  // 资源地址：https://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.20&manage_type=myprojects&projectId=3381398&keyword=&project_type=&page=
  scriptUrl: `${window['GI_PUBLIC_PATH']}libs/font.js`, // 'https://at.alicdn.com/t/font_3381398_5hpi569akv7.js', // 在 iconfont.cn 上生成
});

export default Icon;
