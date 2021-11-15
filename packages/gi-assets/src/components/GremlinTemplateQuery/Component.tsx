import React, { useState, useEffect } from 'react';
import { CloseOutlined, SubnodeOutlined } from '@ant-design/icons';
import { Row, Col, Input, Select, Divider, Button, Spin, Form, Tooltip } from 'antd';
import { GraphinContext } from '@antv/graphin';
import WrapContainer from '../WrapContainer';

import './index.less';
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
    pathName: '最短路径',
    description: '查询两个节点之间的最短路径',
    queryTemplate: `g.V({{sourceId}})
      .repeat(out().simplePath()).until(hasId({{targetId}})
      .or().loops().is(gte({{maxDegree}}))).hasId({{targetId}})
      .path().limit({{limit}})`,
    params: [
      {
        parameterKey: 'sourceId',
        parameterName: '开始节点',
        parameterValue: '',
      },
      {
        parameterKey: 'targetId',
        parameterName: '目标节点',
        parameterValue: '',
      },
      {
        parameterKey: 'maxDegree',
        parameterName: '最大度数',
        parameterValue: '3',
      },
      {
        parameterKey: 'limit',
        parameterName: '限制路径条数',
        parameterValue: '3',
      },
    ],
  },
  {
    pathId: 'cyclicPath',
    pathName: '环路检测',
    description: '检测指定的一个或两个节点是否在环路中，并查询所在的环路',
    queryTemplate: `g.V({{targetId1}})
      .repeat(out().cyclicPath()).until(hasId({{targetId2}})
      .or().loops().is(gte({{maxDegree}}))).hasId({{targetId2}})
      .path().limit({{limit}})`,
    params: [
      {
        parameterKey: 'targetId1',
        parameterName: '目标节点1',
        parameterValue: '',
      },
      {
        parameterKey: 'targetId2',
        parameterName: '目标节点2',
        parameterValue: '',
      },
      {
        parameterKey: 'maxDegree',
        parameterName: '最大度数',
        parameterValue: '3',
      },
      {
        parameterKey: 'limit',
        parameterName: '限制路径条数',
        parameterValue: '3',
      },
    ],
  },
  {
    pathId: 'commonNeighbors',
    pathName: '共同邻居',
  },
];

export interface IGremlinTemplateQueryProps {
  visible: boolean;
  onClose: () => void;
  serviceId: string;
  style?: React.CSSProperties;
}

const GremlinTemplateQuery: React.FC<IGremlinTemplateQueryProps> = ({ visible, onClose, serviceId, style }) => {
  const [form] = Form.useForm();
  const [paramInput, setParamInput] = useState(undefined);
  const [currentTemplate, setCurrentTemplate] = useState({} as any);
  const [templateData, setTemplateData] = useState([] as PathParam[]);

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
          <Input placeholder={`请输入${t.parameterName}`} style={{ border: '1px solid #434343' }} />
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
          {item.pathId === 'commonNeighbors' ? <Tooltip title="敬请期待">{item.pathName}</Tooltip> : item.pathName}
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

  const [showTemplate, setShowTemplate] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);

  /**
   * 填写参数以后执行算法模板
   */
  const handleExecTemplate = async () => {
    setBtnLoading(true);
    const gremlin = currentTemplate.queryTemplate
      .trim()
      .replace(/(\{\{)\w+(\}\})/g, replaceValueFun)
      .replace(/\\n/g, '');

    const { service } = services.find(sr => sr.id === serviceId);
    if (!service) {
      return;
    }

    const result = await service({
      value: gremlin,
    });

    setBtnLoading(false);
    if (!result) {
      return;
    }
    dispatch.changeData(result);
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
      style={{
        visibility: visible ? 'visible' : 'hidden',
        height: 'fit-content',
        ...style,
      }}
    >
      <Row className="header">
        <Col span={22} className="title">
          路径查询
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
              路径列表
              <br />
              <Select
                className="algorithmSelector"
                placeholder="请选择路径模版"
                onChange={templateChange}
                value={currentTemplate && currentTemplate.pathId}
              >
                {templateOptions}
              </Select>
            </div>
            {currentTemplate.description && (
              <div className="blockContainer">
                描述
                <br />
                <span className="description">{currentTemplate.description}</span>
              </div>
            )}
            {paramInput && (
              <div className="blockContainer">
                参数
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
                <div style={{ padding: '8px 0 16px 0' }}>查询语句</div>
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
              查询
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default WrapContainer(GremlinTemplateQuery, {
  icon: <SubnodeOutlined />,
  title: ' Gremlin 路径查询',
  showText: true,
});
