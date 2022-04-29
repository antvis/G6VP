const registerMeta = context => {
  return {
    multiple: {
      type: 'switch',
      default: false,
      name: '多节点展示',
    },
  };
};

export default registerMeta;
