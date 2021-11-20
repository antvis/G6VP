const options = [
  {
    value: 'dark',
    lable: 'dark',
  },
  {
    value: 'light',
    lable: 'light',
  },
];

const registerMeta = context => {
  return {
    /** 放大缩小 */
    // mapmode: {
    //   name: '地图模式',
    //   type: 'group',
    //   enableHide: false,
    //   fold: false,
    //   children: {
    enable: {
      name: '开关',
      type: 'switch',
      default: true,
      statusText: true,
      // },
      // theme: {
      //   name: '主题',
      //   type: 'select',
      //   useFont: true,
      //   default: 'dark',
      //   options,
      // },
      // },
    },
  };
};

export default registerMeta;
