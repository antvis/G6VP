import { CodeOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Modal, Row } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';
import { useCodeSandbox, useHtml, useNodeModule } from '../../hooks';
import { useContext } from '../../pages/Analysis/hooks/useContext';

import { saveAs } from '../utils';
import './index.less';

const ExportSdk = props => {
  const { context: propsContext } = props;
  const { context } = useContext();
  const st = propsContext || context;

  const [state, updateState] = useImmer({
    visible: false,
  });

  const htmlCode = useHtml(st);
  const openCSB = useCodeSandbox(st);
  const openNodeModule = useNodeModule(st);

  /** 下载 */
  const handleExport = () => {
    let [code, ext] = [htmlCode, '.html'];
    //@ts-ignore
    saveAs(code, `gi-export-project-id-${st.id}${ext}`);
  };

  const handleOpen = () => {
    updateState(draft => {
      draft.visible = true;
    });
  };

  const handleClose = () => {
    updateState(draft => {
      draft.visible = false;
    });
  };

  return (
    <div>
      <Button size="small" onClick={handleOpen} icon={<CodeOutlined />} type="text">
        开放
      </Button>
      <Modal
        title="开放集成：画布 SDK 源码导出"
        open={state.visible}
        width={'80%'}
        onCancel={handleClose}
        maskStyle={{ background: 'rgba(0,0,0,0.8)' }}
      >
        <Alert type="info" message="G6VP 支持 3 种导出模式，点击即可体验，建议 UMD 模式" showIcon></Alert>
        <br />
        <Row gutter={[20, 20]}>
          <Col span={8}>
            <Card
              hoverable
              cover={<img src={`${window['GI_PUBLIC_PATH']}image/export_html.png`} onClick={handleExport} />}
            >
              <div className="card-meta">
                <div className="title">HTML 模式</div>
                <div>导出 HTML 适合快速本地查看</div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card hoverable cover={<img src={`${window['GI_PUBLIC_PATH']}image/export_cdn.png`} onClick={openCSB} />}>
              <div className="card-meta">
                <div className="title">UMD 模式</div>
                <div>提供 UMD 包，可 CDN 加载，快速集成到 React 项目中</div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              hoverable
              cover={<img src={`${window['GI_PUBLIC_PATH']}image/export_cdn.png`} onClick={openNodeModule} />}
            >
              <div className="card-meta">
                <div className="title">ESM 模式</div>
                <div>提供 NPM 包，支持 Tree Shaking，原生集成到 React 项目中 </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default ExportSdk;
