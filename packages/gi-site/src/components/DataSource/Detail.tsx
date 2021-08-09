import { Card, Input, Radio } from 'antd';
import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import './index.less';
export interface Option {
  id: string;
  mode: string;
  name: string;
  content: string;
}
interface SidebarProps {
  id: string;
  mode: string;
  name: string;
  content: string;
  handleSave: (options: Option) => void;
}

let monacoRef;
let serviceIDRef;
let serviceNameRef;
let serviceModeRef;

const serviceTypes = [
  {
    label: 'API',
    value: 'api',
    disabled: true,
  },
  {
    label: 'Mock',
    value: 'mock',
  },
];

const Detail: React.FunctionComponent<SidebarProps> = props => {
  const editorDidMount = editor => {
    editor.focus();
  };

  const handleSave = () => {
    const id = serviceIDRef.state.value;
    const name = serviceNameRef.state.value;
    const mode = 'mock'; //serviceModeRef.target.value;
    const monacoModel = monacoRef.editor.getModel();
    const content = monacoModel.getValue();
    console.log(id, name, content, mode);
    props.handleSave({
      id,
      name,
      content,
      mode,
    });
  };

  const { id, mode, content, name } = props;

  const extra = <div onClick={handleSave}> save | delete </div>;

  return (
    <div className="gi-services-editor">
      <Card title="服务详情" extra={extra}>
        服务ID:
        <Input
          placeholder="Basic usage"
          defaultValue={id}
          ref={node => {
            serviceIDRef = node;
          }}
          disabled={id === 'GI_SERVICE_INTIAL_GRAPH'}
        />
        <br />
        服务名称:
        <Input
          placeholder="Basic usage"
          defaultValue={name}
          ref={node => {
            serviceNameRef = node;
          }}
        />
        服务类型:
        <Radio.Group
          options={serviceTypes}
          onChange={value => {
            serviceModeRef = value;
          }}
          defaultValue={mode}
        />
        <br />
        服务实现：
        {mode === 'mock' && (
          <MonacoEditor
            ref={node => {
              monacoRef = node;
            }}
            width="500px"
            height="500px"
            language="json"
            theme="vs-dark"
            defaultValue={content}
            options={{}}
            editorDidMount={editorDidMount}
          />
        )}
      </Card>
    </div>
  );
};

export default Detail;
