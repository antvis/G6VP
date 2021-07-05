import { useRequest } from "@alipay/bigfish"
import { Collapse, Tabs, Button } from 'antd';
import * as React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useDispatch, useSelector } from 'react-redux';
import { getProjectById, updateProjectById } from '../../services';
import './index.less';
const { Panel } = Collapse;

const { TabPane } = Tabs;

interface SourceCodeProps {
  handleClose: () => void;
}
let monacoRef;

const SourceCode: React.FunctionComponent<SourceCodeProps> = props => {
  const { handleClose } = props;
  //@ts-ignore
  const { id } = useSelector(state => state);
  const {data: project = {}, run } = useRequest(() => {
    return getProjectById(id)
  })
  console.log(project)
  const { data } = project;
  const dispatch = useDispatch();

  const editorDidMount = editor => {
    console.log('editorDidMount', editor);
    editor.focus();
  };
  const handleSave = () => {
    const model = monacoRef.editor.getModel();
    const value = model.getValue();
    try {
      console.log(value);
      const newData = JSON.parse(value);
      updateProjectById(id, {
        ...project,
        data: newData,
      }).then(() => {
        dispatch({
          type: 'update:key',
          key: Math.random(),
        });
        handleClose && handleClose();
      });
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    run();
  }, [])

  const code = JSON.stringify(data, null, 2);
  console.log('code *****', code);

  return (
    <div>
      <Button onClick={handleSave} style={{ marginBottom: 15 }}>更新源数据</Button>
      <MonacoEditor
        ref={node => {
          monacoRef = node;
        }}
        width="calc(80vh - 100px)"
        height="80vh"
        language="json"
        theme="vs-dark"
        value={code}
        options={{}}
        editorDidMount={editorDidMount}
      />
    </div>
  );
};

export default SourceCode;
