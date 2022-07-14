import { ExportOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { getRiddleAppCode, useCodeSandbox, useHtml, useRiddle } from '../../hooks';
import { useContext } from '../../pages/Analysis/hooks/useContext';
import { copyText, saveAs } from '../utils';
import './index.less';

const ExportConfig = props => {
  const { context: st } = useContext();

  const exampleCode = getRiddleAppCode(st);
  const htmlCode = useHtml(st);
  const openRiddle = useRiddle(st);

  const openCSB = useCodeSandbox(st);
  /** 复制 */
  const handleCopy = () => {
    const flag = copyText(exampleCode);
    if (flag) {
      message.success('复制成功');
    } else {
      message.error('复制失败');
    }
  };

  /** 下载 */
  const handleExport = () => {
    let [code, ext] = [htmlCode, '.html'];
    //@ts-ignore
    saveAs(code, `gi-export-project-id-${st.id}${ext}`);
  };

  return (
    <div className="export-panel">
      <div className="export-panel-editor">
        <div style={{ width: '100%', height: '100%' }}>
          <MonacoEditor
            language="javascript"
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              readOnly: true,
            }}
            value={htmlCode}
          />
        </div>
      </div>
      <div className="export-panel-footer">
        {/* <Button type="primary" onClick={handleCopy}>
          <CopyOutlined /> 拷贝
        </Button>
        <Button type="primary" onClick={handleExport}>
          <UploadOutlined /> 导出
        </Button> */}
        <Button type="primary" onClick={handleExport}>
          <UploadOutlined /> 导出 HTML 文件
        </Button>
        <Button onClick={openCSB}>
          <ExportOutlined /> 在 CodeSandbox 中打开
        </Button>
      </div>
    </div>
  );
};

export default ExportConfig;
