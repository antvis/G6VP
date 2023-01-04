export default () => {
  return {
    minZoom: {
      title: '最小缩放比例',
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 0.6
    },
    statusName: {
      title: '状态名',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: 'minZoom'
    }
  }
};
