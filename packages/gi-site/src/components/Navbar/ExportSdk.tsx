import { CodeOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Modal, Row } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';
import { ANTD_VERSION, G6_VERSION, GI_THEME_ANTD_VERSION, GI_VERSION, GRAPHIN_VERSION } from '../../../.umirc';
import { useCodeSandbox, useHtml, useNodeModule } from '../../hooks';
import { useContext } from '../../pages/Analysis/hooks/useContext';
import { saveAs } from '../utils';
import './index.less';

const SdkContent = () => {
  const { context: st } = useContext();

  const htmlCode = useHtml(st);
  const openCSB = useCodeSandbox(st);
  const openNodeModule = useNodeModule(st);
  /** 下载 */
  const openHtml = () => {
    let [code, ext] = [htmlCode, '.html'];
    //@ts-ignore
    saveAs(code, `gi-export-project-id-${st.id}${ext}`);
  };

  const THIRD_PARTY_DEPLOYS = Object.values((st.activeAssets && st.activeAssets.deploys) || {});

  const {
    activeAssetsKeys,
    datasetId,
    datasetName,
    config,
    themes,
    engineContext,
    engineId,
    id,
    schemaData,
    data,
    name,
  } = st;

  const deployContext = {
    workbook: {
      id,
      name,
      activeAssetsKeys,
      projectConfig: config,
      themes,
    },
    dataset: {
      id: datasetId,
      engineContext,
      engineId,
      name: datasetName,
      schemaData,
      data: { transData: data },
    },
    deps: {
      react: '18.x',
      'react-dom': '18.x',
      localforage: '1.10.0',
      antd: ANTD_VERSION,
      '@antv/gi-theme-antd': GI_THEME_ANTD_VERSION,
      '@antv/g6': G6_VERSION,
      '@antv/graphin': GRAPHIN_VERSION,
      '@antv/gi-sdk': GI_VERSION,
    },
    GI_ASSETS_PACKAGES: JSON.parse(localStorage.getItem('GI_ASSETS_PACKAGES') || '{}'),
  };
  const counts = THIRD_PARTY_DEPLOYS.length;
  return (
    <>
      <Alert type="info" message={`G6VP 支持 ${counts} 种导出模式，点击即可体验，建议 UMD 模式`} showIcon></Alert>
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
        开放
      </Button>
      {state.visible && (
        <Modal
          title="开放集成：画布 SDK 源码导出"
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
