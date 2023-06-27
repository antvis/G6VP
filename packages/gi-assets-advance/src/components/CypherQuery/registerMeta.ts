import { extra, utils } from '@antv/gi-sdk';
import info from './info';
import $i18n from '../../i18n';
const { GIAC_CONTENT_METAS, deepClone } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = info.icon;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = info.name;

const registerMeta = context => {
  const { services = [], engineId } = context;
  const { options, defaultValue } = utils.getServiceOptionsByEngineId(services, info.services[0], engineId);
  const { options: publishOptions, defaultValue: publishDefaultValue } = utils.getServiceOptionsByEngineId(
    services,
    info.services[1],
    engineId,
  );

  return {
    /** 分类信息 */
    serviceId: {
      title: $i18n.get({ id: 'advance.components.CypherQuery.registerMeta.DataService', dm: '数据服务' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options,
      },
      default: defaultValue,
    },
    limit: {
      title: $i18n.get({ id: 'advance.components.CypherQuery.registerMeta.QueryLimits', dm: '查询限制' }),
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 100,
    },
    isShowPublishButton: {
      title: $i18n.get({ id: 'advance.components.CypherQuery.registerMeta.PublishAsATemplate', dm: '发布成模板' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-reactions': [
        {
          target: 'saveCypherTemplateServceId',
          fulfill: {
            state: {
              visible: '{{$self.value}}',
            },
          },
        },
      ],

      default: false,
    },
    saveCypherTemplateServceId: {
      title: $i18n.get({
        id: 'advance.components.CypherQuery.registerMeta.PublishTemplateService',
        dm: '发布模板服务',
      }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: publishOptions,
      },
      default: publishDefaultValue,
    },
    initialValue: {
      title: $i18n.get({ id: 'advance.components.CypherQuery.registerMeta.InitialStatement', dm: '初始语句' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      default: 'MATCH n RETURN LIMIT 100',
    },
    ...metas,
  };
};

export default registerMeta;
