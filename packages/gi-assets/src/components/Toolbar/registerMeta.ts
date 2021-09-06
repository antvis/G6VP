const registerMeta = context => {
  return {
    /** 放大缩小 */
    zoom: {
      name: '放大/缩小',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        enable: {
          name: '开关',
          type: 'switch',
          default: true,
          statusText: true,
        },
      },
    },
    /** 上一步/下一步 */
    steps: {
      name: '上一步/下一步',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        enable: {
          name: '开关',
          type: 'switch',
          default: true,
          statusText: true,
        },
      },
    },
    /** 视图 */
    view: {
      name: '视图',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        enable: {
          name: '开关',
          type: 'switch',
          default: true,
          statusText: true,
        },
      },
    },
    /** 下载 */
    download: {
      name: '下载',
      type: 'group',
      enableHide: false,
      fold: false,
      children: {
        enable: {
          name: '开关',
          type: 'switch',
          default: true,
          statusText: true,
        },
      },
    },
  };
};

export default registerMeta;
