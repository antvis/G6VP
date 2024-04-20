import { CodeOutlined } from '@ant-design/icons';
import { common } from '@antv/gi-sdk';
import { Alert, Button, Col, Modal, Row } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';
import { useCodeSandbox, useHtml, useNodeModule } from '../../hooks';
import $i18n from '../../i18n';
import { useContext } from '../../pages/Analysis/hooks/useContext';
import getExportContext from './getExportContext';

import './index.less';

const SdkContent = () => {
  const { context: ctx } = useContext();

  const htmlCode = useHtml(ctx);
  const openCSB = useCodeSandbox(ctx);
  const openNodeModule = useNodeModule(ctx);
  /** 下载 */
  const openHtml = () => {
    let [code, ext] = [htmlCode, '.html'];
    common.createDownload(code, `gi-export-project-id-${ctx.id}${ext}`);
  };

  const THIRD_PARTY_DEPLOYS = Object.values((ctx.activeAssets && ctx.activeAssets.deploys) || {});
  const deployContext = getExportContext(ctx);
  const counts = THIRD_PARTY_DEPLOYS.length;

  return (
    <>
      <Alert
        type="info"
        message={$i18n.get(
          {
            id: 'gi-site.components.Navbar.ExportSdk.GVpSupportsCountsExport',
            dm: '支持 {counts} 种导出模式，点击即可体验，建议 UMD 模式',
          },
          { counts: counts },
        )}
        showIcon
      ></Alert>
      <br />
      <Row gutter={[20, 20]}>
        {THIRD_PARTY_DEPLOYS.map((item, index) => {
          //@ts-ignore
          const { component: Component } = item;
          return (
            <Col span={8} key={index}>
              {/** @ts-ignore */}
              {<Component context={deployContext} utils={{ openCSB, openNodeModule, openHtml }} />}
            </Col>
          );
        })}
      </Row>
    </>
  );
};

const ExportSdk = props => {
  const [state, updateState] = useImmer({
    visible: false,
  });

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
        {$i18n.get({ id: 'gi-site.components.Navbar.ExportSdk.Open', dm: '开放' })}
      </Button>
      {state.visible && (
        <Modal
          title={$i18n.get({
            id: 'gi-site.components.Navbar.ExportSdk.OpenIntegrationCanvasSdkSource',
            dm: '开放集成：画布 SDK 源码导出',
          })}
          open={state.visible}
          width={'80%'}
          onCancel={handleClose}
          maskStyle={{ background: 'rgba(0,0,0,0.8)' }}
        >
          <SdkContent />
        </Modal>
      )}
    </div>
  );
};

export default ExportSdk;
