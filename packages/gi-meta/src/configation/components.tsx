// 配置项见文档 https://yuque.antfin-inc.com/aandm7/aighig/mdrghk
// 分析组件分为两种 分析组件和分析交互
import { extractDefault } from '@ali/react-datav-gui-utils';

const configObj = {
  components: {
    name: 'components',
    type: 'menu',
    children: {
      analyze: {
        name: '分析',
        mode: 'single',
        children: {
          "legend": {
            "name": "图例",
            "type": "group",
            fold: false,
            "enableHide": false,
            "children": {
              "sortkey": {
                "name": "分类字段",
                "type": "select",
                "useFont": true,
                "default": "type",
                col: 16,
                "options": [
                  {
                    "value": "description",
                    "label": "description"
                  },
                  {
                    "value": "displayName",
                    "label": "displayName"
                  },
                  {
                    "value": "displayType",
                    "label": "displayType"
                  },
                  {
                    "value": "globalEntityId",
                    "label": "globalEntityId"
                  },
                  {
                    "value": "name",
                    "label": "name"
                  },
                  {
                    "value": "properties",
                    "label": "properties"
                  },
                  {
                    "value": "sceneId",
                    "label": "sceneId"
                  },
                  {
                    "value": "type",
                    "label": "type"
                  },
                  {
                    "value": "uri",
                    "label": "uri"
                  }
                ],
              },
              // "size": {
              //   "type": "stepper",
              //   "caption": "大小",
              //   "min": 0,
              //   "max": 10,
              //   "step": 1,
              //   "col": 12
              // }
            }
          },
          "legendA": {
            "name": "图例",
            "type": "group",
            fold: false,
            "enableHide": false,
            "children": {
              "sortkey": {
                "name": "分类字段",
                "type": "select",
                "useFont": true,
                "default": "type",
                col: 16,
                "options": [
                  {
                    "value": "description",
                    "label": "description"
                  },
                  {
                    "value": "displayName",
                    "label": "displayName"
                  },
                  {
                    "value": "displayType",
                    "label": "displayType"
                  },
                  {
                    "value": "globalEntityId",
                    "label": "globalEntityId"
                  },
                  {
                    "value": "name",
                    "label": "name"
                  },
                  {
                    "value": "properties",
                    "label": "properties"
                  },
                  {
                    "value": "sceneId",
                    "label": "sceneId"
                  },
                  {
                    "value": "type",
                    "label": "type"
                  },
                  {
                    "value": "uri",
                    "label": "uri"
                  }
                ],
              },
              // "size": {
              //   "type": "stepper",
              //   "caption": "大小",
              //   "min": 0,
              //   "max": 10,
              //   "step": 1,
              //   "col": 12
              // }
            }
          }
        },
      },
      interactive: {
        name: '交互',
        mode: 'single',
        children: {
          switch: {
            name: '开关',
            type: 'switch',
            default: true,
          },
        },
      },
    },
  },
};

const valueObj = extractDefault({ config: configObj });
const props = { configObj, valueObj };

export  default props;

