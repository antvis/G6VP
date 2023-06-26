import { GIConfig, GraphSchemaData, utils } from '@antv/gi-sdk';
import Graphin, { GraphinData } from '@antv/graphin';
import { Alert, Button, Card, Col, Row, notification } from 'antd';
import * as React from 'react';
import MonacoEditor from 'react-monaco-editor';
import $i18n from '../../../../i18n';
interface SchemaEditorProps {
  schemaGraph: GraphinData;
  schemaData: GraphSchemaData;
  onSave: (params: any) => void;
  config: GIConfig;
}

let monacoRef;
const SchemaEditor: React.FunctionComponent<SchemaEditorProps> = props => {
  const { schemaData, onSave, config } = props;
  const editorDidMount = editor => {
    editor.focus();
  };
  const [state, setState] = React.useState({
    content: JSON.stringify(schemaData, null, 2),
    schemaGraph: props.schemaGraph,
  });

  const { content, schemaGraph } = state;
  const handleSave = () => {
    const monacoModel = monacoRef.editor.getModel();
    const content = monacoModel.getValue();

    let isError = false;
    let newSchemaData = { ...schemaData };
    try {
      newSchemaData = JSON.parse(content);
    } catch (error) {
      console.log('error', error);
      isError = true;
      notification.error({
        message: $i18n.get({
          id: 'gi-site.MetaPanel.DataPanel.SchemaEditor.ModelFormatParsingFailed',
          dm: '模型格式解析失败',
        }),
        description: error.message,
      });
    }
    if (isError) {
      return;
    }
    //对接服务
    onSave &&
      onSave({
        schemaData: newSchemaData,
      });
  };
  const handlePreview = () => {
    const monacoModel = monacoRef.editor.getModel();
    const content = monacoModel.getValue();

    let newSchemaGraph = schemaGraph;
    try {
      newSchemaGraph = utils.getSchemaGraph(JSON.parse(content), config);
    } catch (error) {
      console.log('error', error);
      notification.error({
        message: $i18n.get({ id: 'gi-site.MetaPanel.DataPanel.SchemaEditor.ModelPreviewFailed', dm: '模型预览失败' }),
        description: error.message,
      });
    }

    setState(preState => {
      return {
        ...preState,
        schemaGraph: newSchemaGraph,
      };
    });
  };

  return (
    <div>
      <Alert
        message={$i18n.get({
          id: 'gi-site.MetaPanel.DataPanel.SchemaEditor.TheGraphModelGraphSchema',
          dm: '该图模型（Graph Schema）是 G6VP 平台根据您上传数据时，指定的节点类型（NodeType）和边类型（EdgeType）自动生成的，您可以在此二次编辑，目前仅提供代码编辑功能，可视化编辑功能，还在开发中...',
        })}
      />
      <Row gutter={8} style={{ marginTop: '12px' }}>
        <Col span={12}>
          <Card
            title={$i18n.get({ id: 'gi-site.MetaPanel.DataPanel.SchemaEditor.SchemaEditing', dm: 'Schema 编辑' })}
            extra={
              <Button type="primary" onClick={handlePreview}>
                {$i18n.get({ id: 'gi-site.MetaPanel.DataPanel.SchemaEditor.VisualPreview', dm: '可视化预览' })}
              </Button>
            }
          >
            <MonacoEditor
              ref={node => {
                monacoRef = node;
              }}
              width="calc(100% + 24px)"
              height="calc(100vh - 350px)"
              language="json"
              theme="vs-light"
              defaultValue={content}
              options={{}}
              editorDidMount={editorDidMount}
            />
          </Card>
        </Col>
        <Col span={12}>
          <div style={{ height: 'calc(100vh - 380px)' }}>
            <Alert
              message={$i18n.get({
                id: 'gi-site.MetaPanel.DataPanel.SchemaEditor.NodetypeNodeType',
                dm: 'nodeType:节点类型',
              })}
              type="success"
              style={{ marginBottom: '8px' }}
            />
            <Alert
              message={$i18n.get({
                id: 'gi-site.MetaPanel.DataPanel.SchemaEditor.PropertiesOtherAttributeFieldsOf',
                dm: 'properties: 节点的其他属性字段',
              })}
              type="success"
              style={{ marginBottom: '8px' }}
            />
            <Alert
              message={$i18n.get({
                id: 'gi-site.MetaPanel.DataPanel.SchemaEditor.NodetypekeyfrompropertiesAttributeFieldsOfThe',
                dm: 'nodeTypeKeyFromProperties: nodeType的映射关系来源的属性字段',
              })}
              type="success"
              style={{ marginBottom: '8px' }}
            />

            <Card
              title={$i18n.get({ id: 'gi-site.MetaPanel.DataPanel.SchemaEditor.PreviewModel', dm: '预览图模型' })}
              style={{ height: '100%' }}
              bodyStyle={{ height: '100%' }}
            >
              <Graphin
                style={{ minHeight: '300px', background: 'var(--background-color)' }}
                data={schemaGraph}
                fitView
                layout={{ type: 'graphin-force', animation: false }}
              ></Graphin>
            </Card>
          </div>
        </Col>
      </Row>
      <Button
        type="primary"
        onClick={handleSave}
        style={{
          position: 'absolute',
          top: '10px',
          right: '80px',
        }}
      >
        {$i18n.get({ id: 'gi-site.MetaPanel.DataPanel.SchemaEditor.SaveModel', dm: '保存模型' })}
      </Button>
    </div>
  );
};

export default SchemaEditor;
