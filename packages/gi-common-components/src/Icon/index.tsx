import { createFromIconfontCN } from '@ant-design/icons';
// 资源地址：https://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.20&manage_type=myprojects&projectId=3381398&keyword=&project_type=&page=
import Graphin from '@antv/graphin';
import font from './font.json';

export const FONT_ID = 'font_3381398_hecr296g6n8';
const scriptUrl = `//at.alicdn.com/t/a/${FONT_ID}.js`;
const glyphs = font.glyphs.map(item => {
  return {
    ...item,
    name: item.font_class, //统一为font class
  };
});
const initFont = () => {
  let fontList = [
    {
      fontUrl: `//at.alicdn.com/t/a/${FONT_ID}.woff2`,
      format: 'woff2',
    },
    {
      fontUrl: `//at.alicdn.com/t/a/${FONT_ID}.woff`,
      format: 'woff',
    },
    {
      fontUrl: `//at.alicdn.com/t/a/${FONT_ID}.ttf`,
      format: 'truetype',
    },
  ];
  const loadFonts = async (fontFamily, fontUrl) => {
    const font = new FontFace(fontFamily, `url(${fontUrl})`);
    await font.load();
    //@ts-ignore
    document.fonts.add(font);
  };
  for (let i in fontList) {
    loadFonts('iconfont', fontList[i].fontUrl);
  }
};

initFont();

// https://github.com/ant-design/ant-design-icons/blob/master/packages/icons-react/src/components/IconFont.tsx
export const Icon = createFromIconfontCN({
  scriptUrl: scriptUrl,
});

// 生成iconLoader函数
const iconLoaderFunction = () => {
  return {
    fontFamily: 'iconfont',
    glyphs: glyphs,
  };
};

// 注册到 Graphin 中
const ilf = iconLoaderFunction();
export const fontFamily = ilf.fontFamily;

export const icons = Graphin.registerFontFamily(iconLoaderFunction);
