import { CloseOutlined } from '@ant-design/icons';
import { useContext } from '@antv/gi-sdk';
import { GraphinContext } from '@antv/graphin';
import { Button, Col, Divider, Form, Input, Row, Select, Spin, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import './index.less';
import $i18n from '../../i18n';

const { Option } = Select;

interface PathParam {
  pathId: string;
  pathName: string;
  description?: string;
  queryTemplate: string;
  params: any[];
}

// 路径查询模板
const pathTemplateList = [
  {
    pathId: 'shortestpath',
    pathName: $i18n.get({ id: 'advance.components.GremlinPathQuery.Component.ShortestPath', dm: '最短路径' }),
    description: $i18n.get({
      id: 'advance.components.GremlinPathQuery.Component.QueryTheShortestPathBetween',
      dm: '查询两个节点之间的最短路径',
    }),
    queryTemplate: `g.V({{sourceId}})
      .repeat(out().simplePath()).until(hasId({{targetId}})
      .or().loops().is(gte({{maxDegree}}))).hasId({{targetId}})
      .path().limit({{limit}})`,
    params: [
      {
        parameterKey: 'sourceId',
        parameterName: $i18n.get({ id: 'advance.components.GremlinPathQuery.Component.StartNode', dm: '开始节点' }),
        parameterValue: '',
      },
      {
        parameterKey: 'targetId',
        parameterName: $i18n.get({ id: 'advance.components.GremlinPathQuery.Component.TargetNode', dm: '目标节点' }),
        parameterValue: '',
      },
      {
        parameterKey: 'maxDegree',
        parameterName: $i18n.get({ id: 'advance.components.GremlinPathQuery.Component.MaximumDegree', dm: '最大度数' }),
        parameterValue: '3',
      },
      {
        parameterKey: 'limit',
        parameterName: $i18n.get({
          id: 'advance.components.GremlinPathQuery.Component.LimitTheNumberOfPaths',
          dm: '限制路径条数',
        }),
        parameterValue: '3',
      },
    ],
  },
  {
    pathId: 'cyclicPath',
    pathName: $i18n.get({ id: 'advance.components.GremlinPathQuery.Component.LoopDetection', dm: '环路检测' }),
    description: $i18n.get({
      id: 'advance.components.GremlinPathQuery.Component.ChecksWhetherOneOrTwo',
      dm: '检测指定的一个或两个节点是否在环路中，并查询所在的环路',
    }),
    queryTemplate: `g.V({{targetId1}})
      .repeat(out().cyclicPath()).until(hasId({{targetId2}})
      .or().loops().is(gte({{maxDegree}}))).hasId({{targetId2}})
      .path().limit({{limit}})`,
    params: [
      {
        parameterKey: 'targetId1',
        parameterName: $i18n.get({ id: 'advance.components.GremlinPathQuery.Component.TargetNode.1', dm: '目标节点1' }),
        parameterValue: '',
      },
      {
        parameterKey: 'targetId2',
        parameterName: $i18n.get({ id: 'advance.components.GremlinPathQuery.Component.TargetNode.2', dm: '目标节点2' }),
        parameterValue: '',
      },
      {
        parameterKey: 'maxDegree',
        parameterName: $i18n.get({ id: 'advance.components.GremlinPathQuery.Component.MaximumDegree', dm: '最大度数' }),
        parameterValue: '3',
      },
      {
        parameterKey: 'limit',
        parameterName: $i18n.get({
          id: 'advance.components.GremlinPathQuery.Component.LimitTheNumberOfPaths',
          dm: '限制路径条数',
        }),
        parameterValue: '3',
      },
    ],
  },
  {
    pathId: 'commonNeighbors',
    pathName: $i18n.get({ id: 'advance.components.GremlinPathQuery.Component.CommonNeighbor', dm: '共同邻居' }),
  },
];

export interface IGremlinTemplateQueryProps {
  visible: boolean;
  onClose: () => void;
  serviceId: string;
  style?: React.CSSProperties;
  controlledValues?: {
    value: string;
  };
}

const GremlinTemplateQuery: React.FC<IGremlinTemplateQueryProps> = ({
  visible,
  onClose,
  serviceId,
  style,
  controlledValues,
}) => {
  const [form] = Form.useForm();
  const [paramInput, setParamInput] = useState(undefined);
  const [currentTemplate, setCurrentTemplate] = useState({} as any);
  const [templateData, setTemplateData] = useState([] as PathParam[]);
  const { updateHistory } = useContext();

  const { services, dispatch } = GraphinContext as any;

  const templateChange = value => {
    // 生成填充参数框
    const tmpTemplate = templateData.filter(d => d.pathId === value);

    const template = tmpTemplate[0];
    const paramNames = template.params;

    const inputDoms = paramNames.map((t, index) => {
      form.setFieldsValue({
        [t.parameterKey]: t.parameterValue,
      });
      return (
        <Form.Item
          className="paramInputContainer"
          label={t.parameterName}
          name={t.parameterKey}
          key={t.parameterName}
          colon={false}
        >
          <Input
            placeholder={$i18n.get(
              {
                id: 'advance.components.GremlinPathQuery.Component.EnterTparametername',
                dm: '请输入{tParameterName}',
              },
              { tParameterName: t.parameterName },
            )}
            style={{ border: '1px solid #434343' }}
          />
        </Form.Item>
      );
    });
    setParamInput(inputDoms as any);
    // 设置当前操作的模板
    setCurrentTemplate(template);
  };

  const [loading, setLoading] = useState(false);
  const [templateOptions, setTemplateOptions] = useState([]);
  const queryPathTemplateList = async () => {
    const options = [];
    pathTemplateList.forEach(item => {
      options.push(
        // @ts-ignore
        <Option key={item.pathId} value={item.pathId} disabled={item.pathId === 'commonNeighbors'}>
          {item.pathId === 'commonNeighbors' ? (
            <Tooltip
              title={$i18n.get({
                id: 'advance.components.GremlinPathQuery.Component.PleaseLookForward',
                dm: '敬请期待',
              })}
            >
              {item.pathName}
            </Tooltip>
          ) : (
            item.pathName
          )}
        </Option>,
      );
    });

    setLoading(false);
    setTemplateOptions(options);
    setTemplateData(pathTemplateList as any);
  };

  useEffect(() => {
    queryPathTemplateList();
  }, []);

  /**
   * 受控参数变化，自动进行分析
   * e.g. ChatGPT，历史记录模版等
   */
  useEffect(() => {
    const { value } = controlledValues || {};
    if (value) {
      const template = templateData.find(d => d.queryTemplate === value);
      if (!template) {
        handleUpateHistory(
          false,
          $i18n.get({
            id: 'advance.components.GremlinPathQuery.Component.TheQueryTemplateDoesNot',
            dm: '本项目不存在该查询模版',
          }),
          value,
        );
        return;
      }
      templateChange(template.pathId);
      handleExecTemplate();
    }
  }, [controlledValues]);

  const [showTemplate, setShowTemplate] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);

  /**
   * 填写参数以后执行算法模板
   */
  const handleExecTemplate = async () => {
    const { service } = services.find(sr => sr.id === serviceId);
    if (!service) {
      return;
    }

    setBtnLoading(true);
    const gremlin = currentTemplate.queryTemplate
      .trim()
      .replace(/(\{\{)\w+(\}\})/g, replaceValueFun)
      .replace(/\\n/g, '');

    const result = await service({
      value: gremlin,
    });

    setBtnLoading(false);
    if (!result) {
      handleUpateHistory(
        false,
        $i18n.get({
          id: 'advance.components.GremlinPathQuery.Component.GremlinTemplateQueryFailed',
          dm: 'Gremlin 模版查询失败',
        }),
        gremlin,
      );
      return;
    }
    handleUpateHistory(result?.success, '', gremlin);
    dispatch.changeData(result);
  };

  /**
   * 更新到历史记录
   * @param success 是否成功
   * @param errorMsg 若失败，填写失败信息
   * @param value 查询语句
   */
  const handleUpateHistory = (success, errorMsg, value) => {
    updateHistory({
      componentId: 'GremlinPathQuery',
      type: 'query',
      subType: $i18n.get({
        id: 'advance.components.GremlinPathQuery.Component.GremlinTemplateQuery',
        dm: 'Gremlin 模版查询',
      }),
      statement: value,
      success,
      errorMsg,
      params: {
        value: value,
      },
    });
  };

  const handleUpdateTempalte = () => {
    setShowTemplate(
      currentTemplate.queryTemplate
        .trim()
        .replace(/(\{\{)\w+(\}\})/g, replaceFun)
        .replace(/\\n/g, ''),
    );
  };

  const replaceValueFun = matchStr => {
    const values = form.getFieldsValue();
    const keys = Object.keys(values);
    // 获取{{}}中间的名称
    const matchArrs = matchStr.match(/\w+/);
    let matchName = matchStr;
    if (matchArrs && matchArrs.length > 0) {
      matchName = matchArrs[0];
    }
    const index = keys.indexOf(matchName);
    let matchValue = matchStr;
    if (index !== -1) {
      matchValue = Object.values(values)[index];
    }

    if (isNaN(Number(matchValue || matchStr))) {
      return `'${matchValue || matchStr}'`;
    }
    return matchValue || matchStr;
  };

  const replaceFun = matchStr => {
    const values = form.getFieldsValue();
    const keys = Object.keys(values);
    // 获取{{}}中间的名称
    const matchArrs = matchStr.match(/\w+/);
    let matchName = matchStr;
    if (matchArrs && matchArrs.length > 0) {
      matchName = matchArrs[0];
    }
    const index = keys.indexOf(matchName);
    let matchValue = matchStr;
    if (index !== -1) {
      matchValue = Object.values(values)[index];
    }
    if (isNaN(Number(matchValue || matchStr))) {
      return `<span style='opacity: 0.2'>'${matchValue || matchStr}'</span>`;
    }
    return `<span style='opacity: 0.2'>${matchValue || matchStr}</span>`;
  };

  useEffect(() => {
    if (currentTemplate.queryTemplate) {
      setShowTemplate(
        currentTemplate.queryTemplate
          .trim()
          .replace(/(\{\{)\w+(\}\})/g, replaceFun)
          .replace(/\\n/g, ''),
      );
    }
  }, [currentTemplate.queryTemplate]);

  const createMarkup = () => {
    return {
      __html: showTemplate,
    };
  };

  return (
    <div
      className="gremlineTemplateQueryPanel"
      style={
        {
          visibility: visible ? 'visible' : 'hidden',
          height: 'fit-content',
          ...style,
        } as any
      }
    >
      <Row className="header">
        <Col span={22} className="title">
          {$i18n.get({ id: 'advance.components.GremlinPathQuery.Component.PathQuery', dm: '路径查询' })}
        </Col>
        <Col span={2}>
          <span className="collapseIcon" onClick={onClose}>
            <CloseOutlined />
          </span>
        </Col>
      </Row>
      {loading ? (
        <Spin style={{ marginLeft: 125, marginTop: 50 }} />
      ) : (
        <>
          <div
            className="contentContainer"
            style={{
              display: 'block',
              visibility: visible ? 'visible' : 'hidden',
            }}
          >
            <div className="blockContainer">
              {$i18n.get({ id: 'advance.components.GremlinPathQuery.Component.PathList', dm: '路径列表' })}

              <br />
              <Select
                className="algorithmSelector"
                placeholder={$i18n.get({
                  id: 'advance.components.GremlinPathQuery.Component.SelectAPathTemplate',
                  dm: '请选择路径模版',
                })}
                onChange={templateChange}
                value={currentTemplate && currentTemplate.pathId}
              >
                {templateOptions}
              </Select>
            </div>
            {currentTemplate.description && (
              <div className="blockContainer">
                {$i18n.get({ id: 'advance.components.GremlinPathQuery.Component.Description', dm: '描述' })}

                <br />
                <span className="description">{currentTemplate.description}</span>
              </div>
            )}

            {paramInput && (
              <div className="blockContainer">
                {$i18n.get({ id: 'advance.components.GremlinPathQuery.Component.Parameter', dm: '参数' })}

                <Form
                  name="paramsForm"
                  form={form}
                  className="paramInputsContainer"
                  layout="vertical"
                  onValuesChange={handleUpdateTempalte}
                >
                  {paramInput}
                </Form>
              </div>
            )}

            {showTemplate && (
              <div className="blockContainer">
                <div style={{ padding: '8px 0 16px 0' }}>
                  {$i18n.get({ id: 'advance.components.GremlinPathQuery.Component.QueryStatement', dm: '查询语句' })}
                </div>
                <pre className="tpre" dangerouslySetInnerHTML={createMarkup()}></pre>
              </div>
            )}
          </div>
          <div
            className="buttonContainer"
            style={{
              display: 'block',
              visibility: visible ? 'visible' : 'hidden',
            }}
          >
            <Divider />
            <Button loading={btnLoading} className="queryButton" type="primary" onClick={handleExecTemplate}>
              {$i18n.get({ id: 'advance.components.GremlinPathQuery.Component.Query', dm: '查询' })}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default GremlinTemplateQuery;
