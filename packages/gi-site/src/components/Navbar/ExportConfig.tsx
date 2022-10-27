import { Alert, Card, Col, Row } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';
import { useCodeSandbox, useHtml } from '../../hooks';
import { useContext } from '../../pages/Analysis/hooks/useContext';

import { saveAs } from '../utils';
import './index.less';

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
    <div className="export-panel">
      <Alert
        type="info"
        message="GraphInsight 提供了 3 种导出SDK的方式，用户可以根据自己需要选择。其中「云端部署」仅限阿里集团使用 ODPS 数据源的用户使用"
        showIcon
      ></Alert>
      <br />
      <Row gutter={20}>
        <Col span={8}>
          <Card
            hoverable
            cover={
              <img
                src={'https://gw.alipayobjects.com/mdn/rms_3e4ddf/afts/img/A*GLvTTbWclicAAAAAAAAAAAAAARQnAQ'}
                onClick={handleExport}
              />
            }
          >
            <div className="card-meta">
              <div className="title">导出 HTML</div>
              <div>适合快速本地查看</div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            hoverable
            cover={
              <img
                src={'https://gw.alipayobjects.com/mdn/rms_3e4ddf/afts/img/A*M_9oSKjA9ksAAAAAAAAAAAAAARQnAQ'}
                onClick={openCSB}
              />
            }
          >
            <div className="card-meta">
              <div className="title">在 CodeSandbox 中打开</div>
              <div>适合集成到 React 项目</div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            hoverable
            cover={
              <img
                src={'https://gw.alipayobjects.com/mdn/rms_3e4ddf/afts/img/A*A9m5R7wxY54AAAAAAAAAAAAAARQnAQ'}
                onClick={handleOpen}
              />
            }
          >
            <div className="card-meta">
              <div className="title">云端部署</div>
              <div>GraphScope 计算+ ODPS 存储部署，详情请咨询 @击铗</div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ExportConfig;
