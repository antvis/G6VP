import { Collapse, Tabs } from 'antd';
import Lockr from 'lockr';
import * as React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useDispatch, useSelector } from 'react-redux';
import './index.less';
const { Panel } = Collapse;

const { TabPane } = Tabs;

interface DataSourceProps {
  handleClose: () => voild;
}
let monacoRef;

const GetSubGraph: React.FunctionComponent<DataSourceProps> = props => {
  const { handleClose } = props;
  const { config, id } = useSelector(state => state);
  const project = Lockr.get(id);
  const { data, services } = project;
  const { getSubGraphDataTransform } = services;

  const dispatch = useDispatch();

  const editorDidMount = editor => {
    editor.focus();
  };
  const handleSave = () => {
    const model = monacoRef.editor.getModel();
    const value = model.getValue();
    try {
      Lockr.set(id, {
        ...project,
        services: {
          ...project.services,
          getSubGraphDataTransform: value,
        },
      });
      dispatch({
        type: 'update:key',
        key: Math.random(),
      });
      handleClose && handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button onClick={handleSave}>根据ID集合，获取子图的接口</button>
      <MonacoEditor
        ref={node => {
          monacoRef = node;
        }}
        width="calc(80vh - 100px)"
        height="80vh"
        language="json"
        theme="vs-dark"
        value={getSubGraphDataTransform}
        options={{}}
        editorDidMount={editorDidMount}
      />
    </div>
  );
};

export default GetSubGraph;
