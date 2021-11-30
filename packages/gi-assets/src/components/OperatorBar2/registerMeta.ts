const registerMeta = context => {
  const { GI_CONTAINER_INDEXS } = context;
  console.log('GI_CONTAINER_INDEXS', GI_CONTAINER_INDEXS);
  return {
    /** 分类信息 */
    GI_CONTAINER: {
      name: '集成组件',
      type: 'TagsSelect',
      default: [],
      options: GI_CONTAINER_INDEXS,
    },
  };
};

export default registerMeta;
