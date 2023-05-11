import * as React from 'react';
import { Form, Input, Popover, Tooltip } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import G6 from '@antv/g6';
import { TemplateNode } from './type';
import ReactJson from 'react-json-view';

/**
 * 历史记录根据类型不同，映射不同颜色，在此增加组件历史记录的分类颜色
 */
export const ColorMap = {
  query: '#227EFF',
  analyse: '#AD5CFF',
  configure: '#00B8B8',
  default: '#7E92B5',
  edge: '#99ADD1',
};

/**
 * 历史记录根据类型不同，映射不同标题文案
 */
export const LabelMap = {
  query: '查询',
  analyse: '分析',
  configure: '配置',
};

/**
 * 从历史记录中生成展示每条记录的 DOM 的列表
 * @param history 历史记录
 * @param urlMap screenShot base64 映射
 * @param style 每条历史记录容器的样式
 * @returns
 */
export const getRecordsFromHistory = (
  history: any, // TODO
  urlMap: { [historyId: string]: string } = {},
  style: React.CSSProperties = {},
) => {
  if (!history) return [];
  const items: React.ReactElement[] = [];
  for (let i = history.length - 1; i >= 0; i--) {
    const { id } = history[i];
    items.push(getRecordContent(history[i], urlMap[id], style));
  }
  return items;
};

/**
 * 获取表示一条历史记录的 DOM
 * @param item 一条历史记录
 * @param screenshotUrl 该记录对应的 screenshot base64
 * @param style 该条记录容器的样式
 * @param showTag 是否展示记录前面的颜色圆点
 * @returns
 */
export const getRecordContent = (
  item: any, // TODO
  screenshotUrl?: string,
  style: React.CSSProperties = {},
  showTag: boolean = true,
): React.ReactElement => {
  const { type, subType, statement, timestamp } = item;
  const date = new Date(timestamp);
  return (
    <div className="gi-analysis-record-wrapper" style={{ ...style }}>
      {showTag ? <div className="gi-analysis-history-tag" style={{ background: ColorMap[type] }} /> : ''}
      {showTag ? <div style={{ color: ColorMap[type] }}>{LabelMap[type]}</div> : ''}
      <span className="gi-analysis-history-statement">
        {LabelMap[type]} ({subType}): {statement}
      </span>
      <span className="gi-analysis-history-time">
        {date.toLocaleDateString()} {date.toLocaleTimeString()}
      </span>
      {screenshotUrl ? (
        <Popover
          placement="top"
          style={{ width: 'fit-content', height: 'fit-content' }}
          content={<img src={screenshotUrl} style={{ width: '300px' }} />}
        >
          <PictureOutlined className="gi-analysis-history-screenshot-icon" />
        </Popover>
      ) : (
        ''
      )}
    </div>
  );
};

const getValueFieldDOM = (value, props) => {
  if (typeof value !== 'object') {
    return <span {...props}>{String(value)}</span>;
  } else {
    return (
      <div className="gi-analysis-history-value-json">
        <ReactJson className="gi-analysis-history-value-json" {...props} src={value} />
      </div>
    );
  }
};

/**
 * 根据字段的层级路径，更新嵌套对象中的某一个值
 * @param obj 原始嵌套对象
 * @param paths 字段的层级路径
 * @param val 新值
 */
export const updateObjWithPaths = (obj: object, paths: string[], val: unknown) => {
  let currentChild = obj;
  paths.forEach((parentField, i) => {
    if (i === paths.length - 1) {
      currentChild[parentField] = val;
    } else {
      currentChild = currentChild[parentField];
    }
  });
};

/**
 * 对于需要部分参数化的、JSON 类型的值，替换原始值中已经被参数化的部分为 ${parameterName}，重新显示到 ReactJSON
 * e.g. 筛选面板的筛选 options
 * @param id
 * @param fieldName
 * @param oriValue
 * @param parameterizedValues
 * @param valueDomProps
 * @param configureOpt
 * @param formItems
 * @param doms
 */
const getJSONParameterizedValueDOM = (
  id: string,
  fieldName: string,
  oriValue: object,
  parameterizedValues: object,
  valueDomProps: object = {},
  configureOpt: object | undefined = undefined,
  formItems: JSX.Element[],
  doms: JSX.Element[],
) => {
  let finalValue: object = JSON.parse(JSON.stringify(oriValue));
  Object.values(parameterizedValues).forEach(item => {
    const { position, parameterName, parameterDesc } = item;
    const { paths, content: str } = position;
    updateObjWithPaths(finalValue, paths, `\${${parameterName}}`);

    const formItemName = `${id}-${fieldName}-${paths.join('-')}-${parameterName}`;
    formItems.push(
      <Form.Item label={parameterName} name={formItemName} style={{ margin: '4px' }}>
        <Input placeholder={str} size="small" width="100%" {...configureOpt} data-name={formItemName} />
        <div style={{ fontSize: '10px', color: 'var(--text-color-secondary)' }}>{parameterDesc}</div>
      </Form.Item>,
    );
  });
  doms.push(
    <div className="gi-analysis-history-value-json">
      <ReactJson {...valueDomProps} src={finalValue} />
    </div>,
  );
};

/**
 * 对于需要部分参数化的、字符串类型的值，生成由为参数化部分 + 参数化部分的 DOMs
 * e.g. 查询组件的查询语句
 * @param id
 * @param fieldName
 * @param oriValue
 * @param parameterizedValues
 * @param valueDomProps
 * @param configureOpt
 * @param doms
 * @param formItems
 */
const getStringParameterizedValueDOM = (
  id: string,
  fieldName: string,
  oriValue: string,
  parameterizedValues: {
    // 需要参数化的字符串的起始/结束位置，以及这一范围内的原始字符串
    position: { start: number; end: number; content: string };
    // 参数化后的参数名（用户命名）
    parameterName: string;
    // 参数化后的参数辅助描述（用户输入）
    parameterDesc?: string;
  }[],
  valueDomProps: object = {},
  configureOpt: object | undefined = undefined,
  doms: JSX.Element[],
  formItems: JSX.Element[],
) => {
  parameterizedValues.sort((a, b) => a.position.start - b.position.start);
  // 逐个找到参数化的位置，start 到 end 的子字符串替换为${参数名}
  let currentBegin = 0;
  parameterizedValues.forEach(({ position, parameterName, parameterDesc }) => {
    const { start, end, content: str } = position;
    const length = start - currentBegin;
    if (length) {
      // 原始值部分
      doms.push(
        getValueFieldDOM(oriValue, {
          ...valueDomProps,
          style: { width: 'fit-content', ...(valueDomProps as any).style },
          dataStart: currentBegin,
        }),
      );
    }
    // 参数化部分
    doms.push(
      <span
        style={{ color: configureOpt ? 'var(--primary-color)' : '#ccc', userSelect: 'none', width: 'fit-content' }}
      >{`\$\{${parameterName}}`}</span>,
    );

    const formItemName = `${id}-${fieldName}-${fieldName}--${parameterName}`;
    formItems.push(
      <Form.Item label={parameterName} name={formItemName} style={{ margin: '4px' }}>
        <Input placeholder={str} size="small" width="100%" {...configureOpt} data-name={formItemName} />
        <div style={{ fontSize: '10px', color: 'var(--text-color-secondary)' }}>{parameterDesc}</div>
      </Form.Item>,
    );
    currentBegin = end;
  });
  if (currentBegin !== (oriValue as string).length) {
    // 最后一部分原始值字符串
    doms.push(
      <textarea
        {...valueDomProps}
        style={{ width: 'fit-content', ...(valueDomProps as any).style }}
        data-start={currentBegin}
      >
        {(oriValue as string).substring(currentBegin)}
      </textarea>,
    );
  }
};

/**
 * 对于需要部分参数化的值，生成 DOMs。再分为字符串和 JSON 两个类型的值来生成不同的结果
 * @param model
 * @param fieldName
 * @param oriValue
 * @param valueDomProps
 * @param configureOpt
 * @returns
 */
const getPartParameterizedValueDOM = (
  model: TemplateNode,
  fieldName: string,
  oriValue: string | object,
  valueDomProps: object = {},
  configureOpt: object | undefined = undefined,
) => {
  const { id, parameterized } = model;
  // 显示原始值和参数化后值的 DOMs
  const doms: JSX.Element[] = [];
  // 应用模版的配置阶段的 input, configureOpt 非 undefined 时生成
  const formItems: JSX.Element[] = [];
  // 历史记录类型是「查询」，且为查询语句
  // 未参数化过，则直接返回原是值的 DOM
  const parameterizedValues = parameterized[fieldName];
  if (!parameterizedValues) return getValueFieldDOM(oriValue, valueDomProps);
  const isJSON = typeof oriValue === 'object';
  if (isJSON) {
    // 是 JSON 的参数
    getJSONParameterizedValueDOM(
      id,
      fieldName,
      oriValue as object,
      parameterizedValues,
      valueDomProps,
      configureOpt,
      formItems,
      doms,
    );
  } else {
    getStringParameterizedValueDOM(
      id,
      fieldName,
      oriValue,
      parameterizedValues as any,
      valueDomProps,
      configureOpt,
      doms,
      formItems,
    );
  }
  return (
    <>
      <div style={{ display: 'inline-block', wordBreak: 'break-all' }}>{doms}</div>
      <div style={{ marginTop: '8px' }}>{configureOpt ? formItems : ''}</div>
    </>
  );
};

/**
 * 对于整体进行参数化的值，生成一个填写原始值的 DOM
 * @param model
 * @param fieldName
 * @param oriValue
 * @param valueDomProps
 * @param configureOpt
 * @returns
 */
const getWholeParameterizedValueDOM = (
  model: TemplateNode,
  fieldName: string,
  oriValue: string,
  valueDomProps: object = {},
  configureOpt: object | undefined = undefined,
) => {
  const { id, parameterized } = model;
  const parameterizedValue = parameterized[fieldName];
  // 若非查询类型记录，或查询类型记录的非查询语句字段
  const formItemName = `${id}-${fieldName}-${fieldName}`;
  return configureOpt && parameterizedValue ? (
    // 在应用模版阶段的配置态下返回参数输入框
    <Form.Item label={fieldName} name={formItemName} style={{ margin: '4px' }}>
      <Input placeholder={oriValue as string} size="small" width="100%" {...configureOpt} data-name={formItemName} />
    </Form.Item>
  ) : (
    // 在沉淀模版的参数化态下直接返回属性值
    <Tooltip title={configureOpt ? '未参数化内容不可修改' : ''}>
      <span {...valueDomProps} style={{ userSelect: 'none', ...(valueDomProps as any).style }}>
        {oriValue}
      </span>
    </Tooltip>
  );
};
/**
 * 参数化值的 DOM：
 * - 查询（query）类型的查询语句，已参数化部分 + 未参数化部分
 * - 其他类型的参数 / 查询类型的其他参数，参数部分
 * @param model 历史记录模版节点
 * @param fieldName 该条值的字段名
 * @param valueDomProps 未参数化部分 DOM 的配置
 * @param configureOpt 应用模版过程中的配置态的 Form 参数，若非 undefined，则代表处于应用模版过程中的配置态
 * @returns
 */
export const getValueDOM = (
  model: TemplateNode,
  fieldName: string,
  valueDomProps: object = {},
  configureOpt: object | undefined = undefined,
) => {
  const { content, params } = model;
  const oriValue = params[fieldName] as object | string;
  const isJSON = typeof oriValue === 'object';
  const isPart = ((content as any).type === 'query' && fieldName === 'value') || isJSON;
  return isPart
    ? getPartParameterizedValueDOM(model, fieldName, oriValue, valueDomProps, configureOpt)
    : getWholeParameterizedValueDOM(model, fieldName, oriValue, valueDomProps, configureOpt);
};

/**
 * 截断字符串
 * @param str 原始字符串
 * @param maxLength 截断长度
 * @returns 格式化后的字符串
 */
export const ellipsisString = (str: string = '', maxLength: number = 5) => {
  if (!str || str.length < maxLength) return str;
  return `${str.substring(0, maxLength)}…`;
};

/**
 * 起点/终点的样式
 */
export const circleNodeStyle = {
  type: 'ccircle',
  style: {
    fill: ColorMap.default,
    r: 20,
    lineWidth: 0,
  },
  labelCfg: {
    style: {
      fill: '#fff',
      cursor: 'default',
    },
  },
};

/**
 * 根据一条历史记录生成一个模版图节点
 * @param history 一条历史记录
 * @param urlMap 截图的 base64 map
 * @returns
 */
export const getHistoryNode = (history: any, urlMap: { [historyId: string]: string }) => {
  const { id, type, subType, statement, timestamp, componentId, params } = history;
  return {
    id,
    type: 'crect',
    label: `${LabelMap[type]}(${subType})`,
    color: ColorMap[type],
    componentId,
    style: {
      fill: ColorMap[type],
      stroke: ColorMap[type],
      lineWidth: 0,
      radius: 6,
      cursor: 'pointer',
    },
    content: {
      type,
      subType,
      statement,
      timestamp,
      img: urlMap[id],
    },
    params,
    parameterized: {},
    configured: {},
  };
};

/**
 * 创建图的 tooltip 实例
 * @param urlMap 截图的 base64 map
 * @returns
 */
export const createTooltip: Function = (urlMap: { [historyId: string]: string }) =>
  new G6.Tooltip({
    offsetX: 350,
    offsetY: 0,
    fixToNode: [0, 0],
    itemTypes: ['node'],
    shouldBegin: evt => {
      if (!evt?.item) return false;
      const id = evt.item.getID();
      return id !== 'start' && id !== 'end';
    },
    getContent: evt => {
      if (!evt?.item) return '';
      const { id, errorMsg, content } = evt.item.getModel() as TemplateNode;
      if (id === 'start' || id === 'end') return '';
      const targetName = (evt.target as any).get('name');
      const outDiv = document.createElement('div');
      if (targetName === 'error-icon' || targetName === 'error-content') {
        outDiv.innerHTML = `<div>${errorMsg}</div>`;
      } else {
        const url = content?.img || urlMap[id as string];
        outDiv.innerHTML = `<img src="${url}" style="width: 200px" />`;
      }
      return outDiv;
    },
  });

/**
 * 创建模版图实例
 * @param container 图容器
 * @param tooltip G6 tooltip 实例
 * @param isConfigure 是否处于应用模版的配置状态
 * @returns
 */
export const createFlowGraph = (container, tooltip, isConfigure) => {
  const width = container?.offsetWidth || 500;
  const height = container?.offsetHeight || 500;
  return new G6.Graph({
    container,
    width,
    height,
    animate: true,
    plugins: [tooltip],
    modes: {
      default: [
        {
          type: 'drag-canvas',
        },
        {
          type: 'scroll-canvas',
          direction: 'y',
        },
      ],
    },
    layout: {
      type: 'dagre',
      ranksep: 10,
      begin: [width / 2, 70],
    },
    defaultNode: {
      type: 'crect',
      isConfigure,
      anchorPoints: [
        [0.5, 0],
        [0.5, 1],
      ],
      labelCfg: {
        style: {
          fill: '#fff',
          cursor: 'pointer',
        },
      },
    },
    defaultEdge: {
      type: 'line',
      sourceAnchor: 1,
      targetAnchor: 0,
      color: ColorMap.edge,
      style: {
        endArrow: {
          path: G6.Arrow.triangle(6, 8),
          fill: ColorMap.edge,
        },
      },
    },
  });
};
