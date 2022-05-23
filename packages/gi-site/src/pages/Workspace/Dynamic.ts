import { dynamic } from 'umi';
export default dynamic({
  loader: async function () {
    const { default: Workspace } = await import(/* webpackChunkName: "external_A" */ './index');
    return Workspace;
  },
});
