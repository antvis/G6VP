const registerLayout = Graphin => {
  Graphin.registerLayout('custom-random', {
    /**
     * 定义自定义行为的默认参数，会与用户传入的参数进行合并
     */
    getDefaultCfg() {
      return {};
    },
    /**
     * 初始化
     * @param {Object} data 数据
     */
    init(data) {
      const { graph, ...layoutConfig } = this;
      const options = {
        ...layoutConfig,
        ...this.getDefaultCfg(),
      };
      const { width, height } = options;

      const { nodes } = data;

      nodes.forEach(node => {
        node.x = Math.round(Math.random() * width);
        node.y = Math.round(Math.random() * height);
      });
    },
    /**
     * 执行布局
     */
    execute() {
      // TODO
    },
    /**
     * 根据传入的数据进行布局
     * @param {Object} data 数据
     */
    layout(data) {
      this.init(data);
      this.execute();
    },

    /**
     * 销毁
     */
    destroy() {
      this.destroyed = true;
    },
  });
};
export default registerLayout;
