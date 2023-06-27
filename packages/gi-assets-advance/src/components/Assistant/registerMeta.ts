import { utils } from '@antv/gi-sdk';
import info from './info';
import $i18n from '../../i18n';

const registerMeta = context => {
  const { services, engineId } = context;
  const { options, defaultValue } = utils.getServiceOptionsByEngineId(services, info.services[0], engineId);

  const schema = {
    apiKey: {
      title: 'API KEY',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input.Password',
      default: '',
    },

    serviceId: {
      title: $i18n.get({ id: 'advance.components.Assistant.registerMeta.DataService', dm: '数据服务' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: options,
      },
      default: defaultValue,
    },
    logo: {
      title: 'Logo',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*n07bSaB--F4AAAAAAAAAAAAADmJ7AQ/original',
    },
    size: {
      title: $i18n.get({ id: 'advance.components.Assistant.registerMeta.Size', dm: '尺寸' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Offset',
      'x-component-props': {
        min: 10,
        max: 100,
      },
      default: [50, 50],
    },
    placement: {
      title: $i18n.get({ id: 'advance.components.Assistant.registerMeta.Location', dm: '位置' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          {
            value: 'LT',
            label: $i18n.get({ id: 'advance.components.Assistant.registerMeta.UpperLeft', dm: '左上' }),
          },
          {
            value: 'RT',
            label: $i18n.get({ id: 'advance.components.Assistant.registerMeta.UpperRight', dm: '右上' }),
          },
          {
            value: 'LB',
            label: $i18n.get({ id: 'advance.components.Assistant.registerMeta.LowerLeft', dm: '左下' }),
          },
          {
            value: 'RB',
            label: $i18n.get({ id: 'advance.components.Assistant.registerMeta.LowerRight', dm: '右下' }),
          },
        ],
      },
      default: 'LT',
    },
    offset: {
      title: $i18n.get({ id: 'advance.components.Assistant.registerMeta.Offset', dm: '偏移量' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Offset',
      'x-component-props': {
        min: 0,
        max: 400,
      },
      default: [100, 20],
    },
    draggable: {
      title: $i18n.get({ id: 'advance.components.Assistant.registerMeta.Draggable', dm: '可拖拽' }),
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    welcome: {
      title: $i18n.get({ id: 'advance.components.Assistant.registerMeta.Welcome', dm: '欢迎语' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-component-props': {
        autoSize: true,
      },
      default: $i18n.get({
        id: 'advance.components.Assistant.registerMeta.HelloIAmGraphinsightAssistant',
        dm: '您好！我是 GraphInsight 助理。请问有什么关于 GraphInsight 的问题或需求？',
      }),
    },
    prompt: {
      title: $i18n.get({ id: 'advance.components.Assistant.registerMeta.PromptWords', dm: '提示词' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-component-props': {
        placeholder: $i18n.get({
          id: 'advance.components.Assistant.registerMeta.SupportedVariablesGraphschemaUsageGraphschema',
          dm: '支持的变量：graphSchema，使用方式："${graphSchema}"',
        }),
        autoSize: true,
      },
      default:
        $i18n.get({
          id: 'advance.components.Assistant.registerMeta.GraphinsightIsAnExtensibleGraph',
          dm: 'GraphInsight 是一个可扩展的图可视分析平台，包括数据源管理、构图、图元素个性化配置、图可视分析等功能模块。',
        }) +
        $i18n.get({
          id: 'advance.components.Assistant.registerMeta.YourTaskIsToAct',
          dm: '你的任务是作为助理机器人，为 GraphInsight 的用户提供使用指引，包括根据用户的需求生成对应的 Cypher 查询语句。',
        }) +
        $i18n.get({
          id: 'advance.components.Assistant.registerMeta.CypherStatementIsAppliedTo',
          dm: 'Cypher 语句是应用于 Neo4j 声明式图查询语言',
        }) +
        $i18n.get({
          id: 'advance.components.Assistant.registerMeta.ForExampleWhenAUser',
          dm: '例如，当用户说“我想找出回答数最多的问题”，你可以以下列方式给出查询：',
        }) +
        '```Cypher\n' +
        'MATCH(q:Question)<-[:ANSWERED]-(a:Answer)\n' +
        'WITH q,count(a)AS answer_count\n' +
        'ORDERBY answer_count DESC\n' +
        'LIMIT1\n' +
        'RETURN q, answer_count\n' +
        '```\n' +
        $i18n.get({
          id: 'advance.components.Assistant.registerMeta.NoteThatYouOnlyNeed',
          dm: '注意只需要返回查询节点即可，不需要查询属性',
        }) +
        $i18n.get({
          id: 'advance.components.Assistant.registerMeta.TheDataInformationOfThe',
          dm: '当前用户查看的图的数据信息如下：',
        }) +
        '${graphSchema}' +
        $i18n.get({
          id: 'advance.components.Assistant.registerMeta.PleaseDoNotAnswerQuestions',
          dm: '请不要回答与 GraphInsight 无关的问题。',
        }) +
        $i18n.get({
          id: 'advance.components.Assistant.registerMeta.YouOnlyNeedToGive',
          dm: '你只需要根据用户的回答给出查询代码，并告知用户正在为您查询，不需要做过多的解释。',
        }) +
        $i18n.get({
          id: 'advance.components.Assistant.registerMeta.StartTheConversationWithThe',
          dm: '下面开始和用户的对话。',
        }),
    },
  };
  return schema;
};

export default registerMeta;
