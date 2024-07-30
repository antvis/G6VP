// 资源地址：https://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.20&manage_type=myprojects&projectId=3381398&keyword=&project_type=&page=

import IconFont, { createFromIconfontCN } from '@ant-design/icons';
import Graphin from '@antv/graphin';
import React, { ElementType } from 'react';
import { loadFontJson, loadUnicodeFont, type FontJson } from './loader';

export const fontFamily = 'iconfont';
export const FONT_3381398 = 'font_3381398_i824ocozt7';

// --- 注册 font icon ---

let icons = Graphin.registerFontFamily(() => ({ fontFamily, glyphs: [] }));
let glyphs: FontJson['glyphs'] = [];

async function loadFontsJson(ids: string[]) {
  const fonts = await Promise.all(ids.map(id => loadFontJson(id)));
  // 合并所有字体
  const _glyphs = fonts.reduce((acc, curr) => {
    acc.push(...curr.glyphs);
    return acc;
  }, [] as FontJson['glyphs']);

  glyphs = _glyphs;
  icons = Graphin.registerFontFamily(() => ({
    fontFamily,
    glyphs: _glyphs.map(item => {
      return {
        ...item,
        name: item.font_class, //统一为font class
      };
    }),
  }));
}

export { glyphs, icons };

// --- 注册 antd iconfont ---
const registeredIds = new Set<string>();
const getIconfontScriptUrl = (id: string) => `//at.alicdn.com/t/a/${FONT_3381398}.js`;

async function loadUnicodeFonts(ids: string[]) {
  await Promise.all(ids.map(id => loadUnicodeFont(id)));
}

export async function registerIconFonts(ids: string[]) {
  const unregisteredIds = ids.filter(id => !registeredIds.has(id));
  if (!unregisteredIds.length) return;

  // register
  createFromIconfontCN({
    scriptUrl: unregisteredIds.map(getIconfontScriptUrl),
  });

  await Promise.all([loadUnicodeFonts(unregisteredIds), loadFontsJson(unregisteredIds)]);

  unregisteredIds.forEach(id => registeredIds.add(id));
}

// 注册内置 iconfont
registerIconFonts([FONT_3381398]);

interface IconProps extends React.HTMLProps<HTMLSpanElement> {
  spin?: boolean;
  rotate?: number;
  type: string;
}

/**
 * @reference https://github.com/ant-design/ant-design-icons/blob/master/packages/icons-react/src/components/IconFont.tsx
 */
export const Icon: ElementType = React.forwardRef<HTMLSpanElement, IconProps>((props, ref) => {
  const { type, children, ...restProps } = props;
  let content: React.ReactNode = null;
  if (props.type) {
    content = <use xlinkHref={`#${type}`} />;
  }
  if (children) {
    content = children;
  }
  return (
    <IconFont {...restProps} ref={ref}>
      {content}
    </IconFont>
  );
});
