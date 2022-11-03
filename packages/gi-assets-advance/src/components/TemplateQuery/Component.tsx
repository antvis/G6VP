import { useContext, utils } from '@antv/gi-sdk';
import { Button, Form, Input, message, Select, Spin } from 'antd';
import copy from 'copy-to-clipboard';
import queryString from 'query-string';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import './index.less';

const { Option } = Select;

export interface TemplateQueryProps {
  visible: boolean;
  templateListServiceId: string;
  execTemplateServiceId: string;
  style?: React.CSSProperties;
}

const TemplatePanel: React.FC<TemplateQueryProps> = ({
  visible = true,
  templateListServiceId,
  execTemplateServiceId,
  style,
}) => {
  const [form] = Form.useForm();
  const [state, setState] = useImmer<{
    paramInput: JSX.Element | null;
    currentTemplate: any;
    templateData: any;
    loading: boolean;
    templateOptions: any[];
    btnLoading: boolean;
    showTemplate: string;
  }>({
    paramInput: null,
    currentTemplate: {},
    templateData: [],
    loading: false,
    templateOptions: [],
    btnLoading: false,
    showTemplate: '',
  });

  const { paramInput, currentTemplate, templateData, loading, templateOptions, btnLoading, showTemplate } = state;
  const { transform, updateContext, services } = useContext();

  const execTemplateService = utils.getService(services, execTemplateServiceId);
  const templateListService = utils.getService(services, templateListServiceId);

  const getTemplateName = (): string => {
    const params = queryString.parse(window.location.search);
    return params.queryTemplateID as string;
  };

  const templateChange = value => {
    // 生成填充参数框
    const tmpTemplate = templateData.filter(d => d.templateId === value);

    const template = tmpTemplate[0];

    // 清空选中的模板
    if (!template) {
      setState(draft => {
        draft.paramInput = null;
        draft.currentTemplate = {};
        draft.showTemplate = '';
      });
      return;
    }

    const paramNames = template.templateParameterList;

    const inputDoms = paramNames.map((t, index) => {
      form.setFieldsValue({
        [t.parameterName]: t.parameterValue,
      });
      return (
        <Form.Item
          className="paramInputContainer"
          label={`参数 ${index + 1}：${t.parameterName}`}
          name={t.parameterName}
          key={t.parameterName}
          colon={false}
        >
          <Input placeholder={`请输入${t.parameterName}`} />
        </Form.Item>
      );
    });
    setState(draft => {
      draft.paramInput = inputDoms;
      draft.currentTemplate = template;
    });
  };

  const queryTemplateList = async () => {
    if (!templateListService) {
      return null;
    }
    setState(draft => {
      draft.loading = true;
    });

    const result: any = await templateListService();

    const { data } = result;
    const options: JSX.Element[] = [];
    data
      // .filter(item => item.graphLanguageType === 'GREMLIN' || item.graphLanguageType === 'ISOGQL')
      .forEach(item => {
        options.push(
          <Option key={item.templateId} value={item.templateId}>
            {item.templateName}
          </Option>,
        );
      });
    setState(draft => {
      draft.loading = false;
      draft.templateData = data;
      draft.templateOptions = options;
    });

    const templateId = getTemplateName();
    // 查询完模板列表以后，如果带有模板，则设置具体参数
    if (templateId) {
      // 生成填充参数框

      const tmpTemplate = data.filter(d => d.templateId === templateId);

      const template = tmpTemplate[0];
      if (!template) {
        return;
      }
      const paramNames = template.templateParameterList;

      // 获取 URL 中的参数及值
      const templateUrlParams = queryString.parse(window.location.search);
      const inputDoms = paramNames.map((t, index) => {
        let pkey = t.parameterName;
        let pvalue = t.parameterValue;
        if (templateUrlParams[pkey]) {
          pvalue = templateUrlParams[pkey];
        }

        form.setFieldsValue({
          [pkey]: pvalue,
        });
        return (
          <Form.Item
            className="paramInputContainer"
            // label={`参数 ${index + 1}：${t.parameterName} (${t.valueType})`}
            label={`参数 ${index + 1}：${pkey}`}
            name={pkey}
            key={pkey}
            colon={false}
          >
            <Input placeholder={`请输入${pkey}`} style={{ border: '1px solid #434343' }} />
          </Form.Item>
        );
      });
      setState(draft => {
        draft.paramInput = inputDoms;
        draft.currentTemplate = template;
      });
    }
  };

  useEffect(() => {
    queryTemplateList();
  }, []);

  // 根据模板参数获取其类型 valueType
  const matchValueType = (key: string) => {
    const paramList = currentTemplate.templateParameterList;
    if (paramList && paramList.length > 0) {
      const tempArr = paramList.filter(v => v.parameterName === key);
      if (tempArr && tempArr.length > 0 && tempArr[0]) {
        return tempArr[0].valueType;
      }
      return 'string';
    }
    return 'string';
  };

  /**
   * 填写参数以后执行算法模板
   */
  const handleExecTemplate = async () => {
    if (!execTemplateService) {
      return null;
    }
    setState(draft => {
      draft.btnLoading = true;
    });
    updateContext(draft => {
      draft.isLoading = true;
    });
    const values = await form.validateFields();
    const paramList: any[] = [];
    for (let key in values) {
      paramList.push({
        parameterName: key,
        parameterValue: values[key],
        valueType: matchValueType(key),
      });
    }

    const result: any = await execTemplateService({
      templateId: currentTemplate.templateId,
      templateParameterList: paramList,
    });

    setState(draft => {
      draft.btnLoading = false;
    });

    updateContext(draft => {
      // @ts-ignore
      const res = transform(result.data);
      draft.data = res;
      draft.source = res;
      draft.isLoading = false;
    });
  };

  const handleUpdateTempalte = () => {
    setState(draft => {
      draft.showTemplate = currentTemplate.queryTemplate
        .trim()
        .replace(/(\{\{)\w+(\}\})/g, replaceFun)
        .replace(/\\n/g, '');
    });
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

    const { templateParameterList } = currentTemplate;
    const currentParams = templateParameterList.find(d => d.parameterName === matchName);

    const index = keys.indexOf(matchName);
    let matchValue = matchStr;
    if (index !== -1) {
      matchValue = Object.values(values)[index];
    }

    // if (isNaN(Number(matchValue || matchStr))) {
    if (currentParams && currentParams.valueType === 'STRING') {
      return `<span style='opacity: 0.2'>'${matchValue || matchStr}'</span>`;
    }
    return `<span style='opacity: 0.2'>${matchValue || matchStr}</span>`;
  };

  useEffect(() => {
    if (currentTemplate.queryTemplate) {
      setState(draft => {
        draft.showTemplate = currentTemplate.queryTemplate
          .trim()
          .replace(/(\{\{)\w+(\}\})/g, replaceFun)
          .replace(/\\n/g, '');
      });
    }
  }, [currentTemplate.queryTemplate]);

  const createMarkup = () => {
    return {
      __html: showTemplate,
    };
  };

  return (
    <div className="templateQueryContainer" style={style}>
      {loading ? (
        <Spin style={{ marginTop: 50 }} />
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
              <div className="template-title">
                模版
                {currentTemplate.templateId && (
                  <>
                    （
                    <span
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        copy(currentTemplate.templateId);
                        message.success('复制成功');
                      }}
                    >
                      {currentTemplate.templateId}
                    </span>
                    ）
                  </>
                )}
              </div>
              <Select
                allowClear
                className="templateSelector"
                placeholder="请选择模版"
                onChange={templateChange}
                dropdownClassName="dropDown"
                showSearch
                value={(currentTemplate && currentTemplate.templateId) || getTemplateName()}
              >
                {templateOptions}
              </Select>
            </div>
            {currentTemplate.description && (
              <div className="blockContainer">
                <div className="template-title">模版描述</div>
                <span className="description">{currentTemplate.description}</span>
              </div>
            )}
            {paramInput && (
              <div className="blockContainer">
                <div className="template-title">模板参数</div>
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
                <div style={{ padding: '8px 0 10px 0', fontWeight: 'bold' }}>模板语句</div>
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
            <Button loading={btnLoading} type="primary" onClick={handleExecTemplate}>
              查询
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TemplatePanel;
