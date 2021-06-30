import { CopyOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import dayjs from 'dayjs';
import MonacoEditor from 'react-monaco-editor';
import { useSelector } from 'react-redux';
import { copyText, generatorconfigToCode, saveAs } from '../utils';
import './index.less';

const ExportConfig = props => {
  const config = useSelector(state => state.config);
  const exampleCode = generatorconfigToCode(config);
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
    let [code, ext] = [exampleCode, '.js'];
    saveAs(code, `graphInsight-${dayjs().format('YYYYMMDD HH:mm:ss')}${ext}`);
  };

  return (
    <div className="export-panel">
      <div className="export-panel-editor">
        <div style={{ width: 770, height: '100%' }}>
          <MonacoEditor
            language="javascript"
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              readOnly: true,
            }}
            value={exampleCode}
          />
        </div>
      </div>
      <div className="export-panel-footer">
        <Button type="primary" onClick={handleCopy}>
          <CopyOutlined /> 拷贝
        </Button>
        <Button type="primary" onClick={handleExport}>
          <UploadOutlined /> 导出
        </Button>
      </div>
      {/* <span>{exampleCode}</span> */}
    </div>
  );
};

export default ExportConfig;
