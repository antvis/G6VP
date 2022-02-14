const registerMeta = context => {
  const { GI_CONTAINER_INDEXS } = context;
  return {
    GI_CONTAINER: {
      name: '集成组件',
      type: 'TagsSelect',
      default: [],
      options: GI_CONTAINER_INDEXS,
    },
  };
};

export default registerMeta;
