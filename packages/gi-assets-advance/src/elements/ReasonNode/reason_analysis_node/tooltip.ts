import { IColorPair } from './colors';
// @ts-ignore
import styles from './tooltip.less';

/**
 * 通用的Tooltip
 */
export class Tooltip {
  private domContainer: HTMLDivElement | undefined;

  private static instance: Tooltip;

  private constructor() {
    this.domContainer = genDivContaienr();
  }

  public static getInstance() {
    if (!Tooltip.instance) {
      Tooltip.instance = new Tooltip();
    }
    return Tooltip.instance;
  }

  public buildContent(addingContent: (toAppendDoms: HTMLElement[]) => void) {
    if (!this.domContainer) return undefined;

    const toAppendDoms: HTMLElement[] = [];

    addingContent(toAppendDoms);

    // 整体挂载
    toAppendDoms.forEach(dom => {
      this.domContainer?.appendChild(dom);
    });

    return this;
  }

  public show(x: number, y: number) {
    if (!this.domContainer) return undefined;
    this.domContainer?.setAttribute('style', getContaienrStyle(x, y));

    return this;
  }

  public hide() {
    try {
      document.getElementById('wrapper_tree')?.removeChild(this.domContainer!);
      this.domContainer = genDivContaienr();
    } catch (e) {
      // dev环境热更新可能会走到这里，下面一行容错：
      this.domContainer = genDivContaienr();
    }
  }
}

// 得到contaienr
function genDivContaienr() {
  const contaienr = document.createElement('div');
  contaienr.setAttribute('style', getContaienrStyle(-500, -100));
  document.getElementById('wrapper_tree')?.appendChild(contaienr);
  return contaienr;
}

// tooltip容器的样式
export function getContaienrStyle(x: number, y: number) {
  return `
    position:absolute;
    top:${y}px;
    left:${x}px;
    min-width: 132px;
    min-height: 20px;
    padding: 12px;
    background: #000000;
    box-shadow: 0px 3px 8px 2px rgba(0, 0, 0, 0.25);
    color: white;
    border-radius: 4px;
  `;
}

// 得到一个通用的tooltip标题
// value可能没有
export function createCommonTitle(title: string, indicatorColor: string = 'white', value?: any) {
  const titleDom = document.createElement('div');
  titleDom.innerHTML = `
    <div class="${styles.titleContainer}">
      <div class="${styles.indicator}" style="background:${indicatorColor}"></div>
      <div class="${styles.title} style="color:${indicatorColor}">${title}</div>
      ${
        value
          ? `
          <div class="${styles.value}">${value}</div>
        `
          : ''
      }
    </div>
  `;

  return titleDom;
}

// 得到通用的属性详细信息容器
export function createCommonAttrsContainer() {
  const attrContainer = document.createElement('div');
  attrContainer.setAttribute('class', styles.attrContainer_common);
  return attrContainer;
}

// 得到通用的具体某一行信息
export function createCommonAttrInfoItem(
  key: string,
  value: any,
  color: string,
  isCurrent = false,
  needIcon = false,
) {
  const itemDom = document.createElement('div');
  itemDom.setAttribute('class', styles.attrItem_common);

  itemDom.innerHTML = `
    <div class="${styles.key}">
      ${
        needIcon
          ? `<div class="${styles.keyIcon}" ${
              isCurrent ? `style="background:${color}"` : `style="border:1px solid ${color}"`
            } ></div>`
          : ''
      }
      ${needIcon ? key : `<div style="color:${color}">${key}</div>`}
    </div>
    <div class="${styles.value}" style="color:lightgray">${value}</div>
  `;
  return itemDom;
}

export type IShowingCommonData = {
  title: string;
  colorPair: IColorPair;
  attrs: Array<{
    key: string;
    value: any;
    color: string;
    needIcon?: boolean;
    isCurrent?: boolean;
  }>;
};

export type IKVAttrs = {
  key: string;
  value: any;
  inicatorColor: string;
};

// export type IShowingMoreDemensions = Array<IShowingCommonData>;

// 基于getCommonContent
// 处理多组数据的
export function getContentMoreDemensions(
  toAppendDoms: HTMLElement[],
  mainDatas: IShowingCommonData,
  otherDatas: Array<IKVAttrs>,
) {
  // 主要的指标
  // 应业务方要求先注释了
  // getCommonContent(toAppendDoms, mainDatas);

  // 其他指标
  getOhterContent(toAppendDoms, otherDatas);
}

function getOhterContent(toAppendDoms: HTMLElement[], otherDatas: Array<IKVAttrs>) {
  otherDatas.forEach(data => {
    // getSimpleKVContent(toAppendDoms, data);
    const { key, value, inicatorColor } = data;
    toAppendDoms.push(createCommonTitle(key, inicatorColor, value));
  });
}

/**
 * 通用的tooltip内容
 * 其内容是title + kv属性列表
 * @param toAppendDoms 待增加到tooltip容器中的dom节点的集合
 * @param data 数据
 */
export function getCommonContent(toAppendDoms: HTMLElement[], data: IShowingCommonData) {
  // 标题
  const titleDom = createCommonTitle(data.title, data.colorPair.primary);

  toAppendDoms.push(titleDom);

  // 属性
  const attrContainer = createCommonAttrsContainer();
  data.attrs.forEach(({ key, value, color, isCurrent = false, needIcon = false }) => {
    const itemDom = createCommonAttrInfoItem(key, value, color, isCurrent, needIcon);
    attrContainer.appendChild(itemDom);
  });

  toAppendDoms.push(attrContainer);
}

export type ISimpleKVTooltipData = {
  key: string;
  value: string;
  inicatorColor: string;
};

/**
 * 通用的tooltip内容
 * 这种是比较简单的只有 一对kv属性
 * @param toAppendDoms 待增加到tooltip容器中的dom节点的集合
 * @param data 数据
 */
export function getSimpleKVContent(toAppendDoms: HTMLElement[], data: ISimpleKVTooltipData) {
  const { key, value, inicatorColor } = data;
  const kvDom = createCommonAttrInfoItem(key, value, inicatorColor, true, true);
  toAppendDoms.push(kvDom);
}

/**
 * 通用tooltip的内容
 * 最简单形式：纯文本
 * @param toAppendDoms 待增加到tooltip容器中的dom节点的集合
 * @param text 纯文本
 */
export function getTextContent(toAppendDoms: HTMLElement[], text: string) {
  const itemDom = document.createElement('div');
  itemDom.setAttribute('class', styles.attrItem_common);
  itemDom.innerHTML = `
    <div class="${styles.key}">
      ${text}
    </div>
  `;

  toAppendDoms.push(itemDom);
}
