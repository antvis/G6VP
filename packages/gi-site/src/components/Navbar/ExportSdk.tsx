import { CodeOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Modal, Row } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';
import { ANTD_VERSION, G2PLOT_VERSION, G6_VERSION, GI_VERSION, GRAPHIN_VERSION } from '../../../.umirc';
import { useCodeSandbox, useHtml, useNodeModule } from '../../hooks';
import { useContext } from '../../pages/Analysis/hooks/useContext';
import { saveAs } from '../utils';
import $i18n from '../../i18n';
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
      React: {
        url: 'https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.production.min.js',
        name: 'react-dom',
        version: '17.0.2',
        global: 'React',
      },
      ReactDOM: {
        url: 'https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.production.min.js',
        name: 'react-dom',
        version: '17.0.2',
        global: 'ReactDOM',
      },
      antd: {
        url: `https://gw.alipayobjects.com/os/lib/antd/${ANTD_VERSION}/dist/antd.min.js`,
        name: 'antd',
        version: ANTD_VERSION,
        global: 'antd',
      },
      G6: {
        url: `https://gw.alipayobjects.com/os/lib/antv/g6/${G6_VERSION}/dist/g6.min.js`,
        name: '@antv/g6',
        version: G6_VERSION,
        global: 'G6',
      },
      Graphin: {
        url: `https://gw.alipayobjects.com/os/lib/antv/graphin/${GRAPHIN_VERSION}/dist/graphin.min.js`,
        name: '@antv/graphin',
        version: GRAPHIN_VERSION,
        global: 'Graphin',
      },
      GISDK: {
        name: '@antv/gi-sdk',
        version: GI_VERSION,
        url: `https://gw.alipayobjects.com/os/lib/antv/gi-sdk/${GI_VERSION}/dist/index.min.js`,
        global: 'GISDK',
      },
      G2Plot: {
        url: `https://gw.alipayobjects.com/os/lib/antv/g2plot/${G2PLOT_VERSION}/dist/g2plot.min.js`,
        name: '@antv/g2plot',
        version: G2PLOT_VERSION,
        global: 'G2Plot',
      },
      // '@antv/gi-theme-antd': {
      //   name: '@antv/gi-sdk',
      //   version: GI_THEME_ANTD_VERSION,
      //   url: '',
      //   global: '@antv/gi-theme-antd',
      // },
    },
    GI_ASSETS_PACKAGES: JSON.parse(localStorage.getItem('GI_ASSETS_PACKAGES') || '{}'),
  };
  const counts = THIRD_PARTY_DEPLOYS.length;
  return (
    <>
      <Alert
        type="info"
        message={$i18n.get(
          {
            id: 'gi-site.components.Navbar.ExportSdk.GVpSupportsCountsExport',
            dm: 'G6VP 支持 {counts} 种导出模式，点击即可体验，建议 UMD 模式',
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
