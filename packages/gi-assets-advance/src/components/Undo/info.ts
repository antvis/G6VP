import $i18n from '../../i18n';
const info = {
  id: 'Undo',
  name: $i18n.get({ id: 'advance.components.Undo.info.Revoke', dm: '撤销' }),
  desc: $i18n.get({ id: 'advance.components.Undo.info.UndoTheCanvasReturnsTo', dm: '撤销，画布返回上一步状态' }),
  cover: $i18n.get({ id: 'advance.components.Undo.info.Revoke', dm: '撤销' }),
  category: 'canvas-interaction',
  type: 'GIAC',
  icon: 'icon-undo',
  docs: 'https://www.yuque.com/antv/gi/qe8vp7n9snmv54qn',
};
export default info;
