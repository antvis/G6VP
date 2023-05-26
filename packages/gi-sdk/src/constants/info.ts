/**
 * 组件类型
 * @description 详见
 */
export const COMPONENT_TYPE1 = Object.freeze({
  /** 容器组件 */
  CONTAINER: {
    /** 负责整个画布的页面布局 */
    LAYOUT: 'GICC_LAYOUT',
    /** 用于集成 ACTION 组件 */
    ACTION: 'GICC',
    /** 用于集成 CONTENT 组件 */
    CONTENT: 'GICC_CONTENT',
    /** 用于集成 MENU 组件，比如右键菜单 */
    MENU: 'GICC_MENU',
  },
  /** 组件 */
  COMPONENT: {
    /**
     * 由 <GIAC /> 开发的 Action 类型组件
     *
     * 通常用于集成一些按钮等
     * @example
     * import { extra } from '@antv/gi-sdk';
     *
     * const { GIAComponent } = extra;
     * const Component = (props) => {
     *  const { GIAC } = props;
     *  const action = () => { do something }
     *  return <GIAComponent GIAC={GIAC} onClick={action} />
     * }
     *
     */
    ACTION: 'GIAC',
    /**
     * 常规的组件，渲染的组件会放置到画布容器中
     * @example
     * const Component = () => {
     *  return (<div>组件内容</div>)
     * }
     */
    CONTENT: 'GIAC_CONTENT',
    /**
     * 在菜单中添加的选项
     * @example
     * import { Menu } from 'antd';
     *
     * const Component = () => {
     *  return (<Menu.Item>菜单选项</Menu.Item>)
     * }
     */
    MENU: 'GIAC_MENU',
  },
  /**
   * 自运行组件，不需要放置于容器当中，可以自由布局。例如在画布中添加悬浮图标
   * @example
   * const Component = () => {
   *   return <div style={{ position: 'absolute' }}>组件内容</div>;
   * };
   */
  AUTO: 'AUTO',
});

/**
 * 组件类型
 * @description 详见
 */
export enum COMPONENT_TYPE {
  /** 容器组件 - 负责整个画布的页面布局 */
  CONTAINER_LAYOUT = 'GICC_LAYOUT',
  /** 容器组件 - 用于集成 ACTION 组件 */
  CONTAINER_ACTION = 'GICC',
  /** 容器组件 - 用于集成 CONTENT 组件 */
  CONTAINER_CONTENT = 'GICC_CONTENT',
  /** 容器组件 - 用于集成 MENU 组件，比如右键菜单 */
  CONTAINER_MENU = 'GICC_MENU',
  /**
   * 组件 - 由 <GIAC /> 开发的 Action 类型组件
   *
   * 通常用于集成一些按钮等
   * @example
   * import { extra } from '@antv/gi-sdk';
   *
   * const { GIAComponent } = extra;
   * const Component = (props) => {
   *  const { GIAC } = props;
   *  const action = () => { do something }
   *  return <GIAComponent GIAC={GIAC} onClick={action} />
   * }
   *
   */
  COMPONENT_ACTION = 'GIAC',
  /**
   * 组件 - 渲染的组件会放置到画布容器中
   * @example
   * const Component = () => {
   *  return (<div>组件内容</div>)
   * }
   */
  COMPONENT_CONTENT = 'GIAC_CONTENT',
  /**
   * 组件 - 在菜单中添加的选项
   * @example
   * import { Menu } from 'antd';
   *
   * const Component = () => {
   *  return (<Menu.Item>菜单选项</Menu.Item>)
   * }
   */
  COMPONENT_MENU = 'GIAC_MENU',
  /**
   * 自运行组件 - 不需要放置于容器当中，可以自由布局。例如在画布中添加悬浮图标
   * @example
   * const Component = () => {
   *   return <div style={{ position: 'absolute' }}>组件内容</div>;
   * };
   */
  AUTO = 'AUTO',
}

/**
 * 元素类型
 */
export enum ELEMENT_TYPE {
  /** 节点 */
  NODE = 'NODE',
  /** 边 */
  EDGE = 'EDGE',
  /** 布局 */
  LAYOUT = 'LAYOUT',
}

/**
 * 组件类别
 */
export enum CATEGORY {
  /** 容器组件 */
  CONTAINER_COMPONENTS = 'container-components',
  /** 画布交互 */
  CANVAS_INTERACTION = 'canvas-interaction',
  /** 元素交互 */
  ELEMENTS_INTERACTION = 'elements-interaction',
  /** 数据分析 */
  DATA_ANALYSIS = 'data-analysis',
  /** 数据查询 */
  DATA_QUERY = 'data-query',
  /** 系统交互 */
  SYSTEM_INTERACTION = 'system-interaction',
  /** 样式分析 */
  STYLING_ANALYSIS = 'styling-analysis',
  /** 算法分析 */
  ALGORITHM_ANALYSIS = 'algorithm-analysis',
  /** 工作簿 */
  WOOKBOOK = 'workbook',
}
