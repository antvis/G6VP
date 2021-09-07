const registerMeta = context => {
  return {
    /** 放大缩小 */
    mapmode: {
      name: '地图模式',
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
