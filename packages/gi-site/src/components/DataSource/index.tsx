import { Collapse, notification, Tabs } from 'antd';
import * as React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useDispatch, useSelector } from 'react-redux';
const { Panel } = Collapse;

const { TabPane } = Tabs;

interface DataSourceProps {}
let monacoRef;

const DataSource: React.FunctionComponent<DataSourceProps> = props => {
  const data = useSelector(state => state.data);

  const dispatch = useDispatch();

  const editorDidMount = editor => {
    console.log('editorDidMount', editor);
    editor.focus();
  };
  const handleSave = () => {
    const model = monacoRef.editor.getModel();
    const value = model.getValue();

    let data = { nodes: [], edges: [] };
    try {
      data = JSON.parse(value);
      dispatch({
        type: 'Update_Data',
        data,
      });
    } catch (error) {
      console.log(error);
      notification.error({
        message: `解析出错`,
        description: `请检查数据是否为严格JSON格式:${error}`,
        placement: 'topLeft',
      });
    }
  };

  const code = JSON.stringify(data, null, 2);

  return (
    <div>
      <Tabs tabPosition={'left'}>
        <TabPane tab="原始数据" key="source">
          <button onClick={handleSave}> save</button>
          <MonacoEditor
            ref={node => {
              monacoRef = node;
            }}
            width="100%"
            height="80vh"
            language="json"
            theme="vs-dark"
            value={code}
            options={{}}
            editorDidMount={editorDidMount}
          />
        </TabPane>
        <TabPane tab="数据服务" key="initial">
          初始化加载数据
        </TabPane>
      </Tabs>
    </div>
  );
};

export default DataSource;
