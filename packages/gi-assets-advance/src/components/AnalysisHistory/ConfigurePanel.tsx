import React, { CSSProperties } from 'react';
import { Divider, Form } from 'antd';
import { getValueDOM } from './util';
import { TemplateNode } from './type';
import './index.less';
import $i18n from '../../i18n';

export interface ConfigurepanelProps {
  // 正在配置中的模版图节点
  configuring?: TemplateNode;
  // 更换正在配置中的模版图节点
  updateConfigure: (id: string, values) => void;
}

/**
 * 应用模版抽屉中右侧的参数配置面板
 * @param props
 * @returns
 */
const Configurepanel: React.FC<ConfigurepanelProps> = props => {
  const [form] = Form.useForm();
  const { configuring, updateConfigure } = props;
  const { content, params } = (configuring as any) || {};

  /**
   * 该节点的描述内容，包括 statement 和 时间
   * @returns
   */
  const getDescription = () => {
    const { statement, timestamp } = content;
    const date = new Date(timestamp);
    return (
      <>
        <span className="gi-analysis-history-statement">{statement}</span>
        <div className="gi-analysis-history-time" style={{ fontSize: '10px' }}>
          {date.toLocaleDateString()} {date.toLocaleTimeString()}
        </div>
      </>
    );
  };

  /**
   * 参数输入框 DOM 的失焦监听，将表单内容更新到正在配置的模版图节点上
   * @returns
   */
  const handleConfigBlur = evt => {
    const val = evt.target.value;
    const name = evt.target.getAttribute('data-name');
    if (!configuring) return;
    const formValues = form.getFieldsValue();
    if (val && !formValues[name]) {
      formValues[name] = val;
      form.setFieldValue(name, val);
    }
    updateConfigure(configuring.id, formValues);
  };

  const containerStyle = { width: '50%' };

  return configuring ? (
    <div className="gi-history-modal-configure-panel" style={containerStyle}>
      <h4>{configuring.label}</h4>
      <Divider type="horizontal" style={{ margin: '12px 0' }} />
      <div style={{ margin: '8px 0', wordBreak: 'break-all' }}>{getDescription()}</div>
      <Form form={form}>
        <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
          {$i18n.get({ id: 'advance.components.AnalysisHistory.ConfigurePanel.Description', dm: '描述：' })}
          {configuring.description ||
            $i18n.get({ id: 'advance.components.AnalysisHistory.ConfigurePanel.None', dm: '无' })}
        </div>
        {Object.keys(params).map(fieldName => (
          <div className="gi-history-modal-configure-field" style={{ marginTop: '12px', display: 'block' }}>
            <div className="gi-history-modal-configure-parameterize-fieldname">{fieldName}:</div>
            <div style={{ borderRadius: '6px', padding: '4px', border: '1px solid #d9d9d9', wordBreak: 'break-all' }}>
              {getValueDOM(
                configuring,
                fieldName,
                {
                  className: 'gi-history-modal-configure-value',
                  style: { border: 'unset', userSelect: 'none' },
                },
                {
                  onBlur: handleConfigBlur,
                },
              )}
            </div>
          </div>
        ))}
      </Form>
    </div>
  ) : (
    <div className="gi-history-modal-configure-panel" style={containerStyle}>
      {$i18n.get({
        id: 'advance.components.AnalysisHistory.ConfigurePanel.ClickANodeToConfigure',
        dm: '请点击一个节点进行参数配置',
      })}
    </div>
  );
};

export default Configurepanel;
