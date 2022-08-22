import { Modal, Card, Row, Col } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';
import ODPSDeploy from '../ODPSDeploy';
import { useCodeSandbox, useHtml } from '../../hooks';
import { useContext } from '../../pages/Analysis/hooks/useContext';
import { saveAs } from '../utils';
import './index.less';
import { driver } from 'localforage';

const testImg = 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*FZLuRI0h-HMAAAAAAAAAAAAAARQnAQ';

const ExportConfig = props => {
  const { context: st } = useContext();

  const [state, updateState] = useImmer({
    visible: false,
  });

  const htmlCode = useHtml(st);
  const openCSB = useCodeSandbox(st);

  /** 下载 */
  const handleExport = () => {
    let [code, ext] = [htmlCode, '.html'];
    //@ts-ignore
    saveAs(code, `gi-export-project-id-${st.id}${ext}`);
  };

  const handleOpenModal = () => {
    updateState(draft => {
      draft.visible = true;
    });
  };

  const handleCloseModal = () => {
    updateState(draft => {
      draft.visible = false;
    });
  };

  return (
    <div className="export-panel">
      <Row gutter={20}>
        <Col span={8}>
          <Card hoverable cover={<img src={testImg} onClick={handleExport} />}>
            <div className="card-meta">
              <div className="title">导出 HTML</div>
              <div>适合快速本地查看</div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable cover={<img src={testImg} onClick={openCSB} />}>
            <div className="card-meta">
              <div className="title">在 CodeSandbox 中打开</div>
              <div>适合集成到 React 项目</div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable cover={<img src={testImg} onClick={handleOpenModal} />}>
            <div className="card-meta">
              <div className="title">云端部署</div>
              <div>GraphScope 计算+ ODPS 存储部署</div>
            </div>
          </Card>
        </Col>
      </Row>
      <Modal
        visible={state.visible}
        onCancel={handleCloseModal}
        mask={false}
        maskClosable={false}
        footer={null}
        bodyStyle={{ paddingTop: '40px' }}
      >
        <ODPSDeploy></ODPSDeploy>
      </Modal>
    </div>
  );
};

export default ExportConfig;
