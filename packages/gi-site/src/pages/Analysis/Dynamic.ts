import { dynamic } from 'umi';
export default dynamic({
  loader: async function () {
    const { default: Analysis } = await import(/* webpackChunkName: "external_A" */ './index');
    return Analysis;
  },
});
