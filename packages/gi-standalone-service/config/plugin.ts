import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  // static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },
};

export default plugin;
