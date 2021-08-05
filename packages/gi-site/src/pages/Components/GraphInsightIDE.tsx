import React, { useRef } from 'react';
import { AppRenderer, SlotLocation, SlotRenderer, SplitPanel, BoxPanel } from '@alipay/alex/bundle';
import '@alipay/alex/bundle/alex.css';
// 语法高亮
import '@alipay/alex/languages/html';
// import '@alipay/alex/languages/handlebars'
import '@alipay/alex/languages/css';
import '@alipay/alex/languages/scss';
import '@alipay/alex/languages/less';
import '@alipay/alex/languages/javascript';
import '@alipay/alex/languages/typescript';
import '@alipay/alex/languages/json';

// 语言功能
import html from '@alipay/alex/extensions/alex.html-language-features-worker';
import css from '@alipay/alex/extensions/alex.css-language-features-worker';
import typescript from '@alipay/alex/extensions/alex.typescript-language-features-worker';
import json from '@alipay/alex/extensions/alex.json-language-features-worker';

import { getFileDirectory, getFileBlob } from '../../services/assets';

// 布局配置
const layoutConfig = {
  [SlotLocation.action]: {
    modules: [''],
  },
  [SlotLocation.left]: {
    modules: ['@ali/ide-explorer'],
  },
  [SlotLocation.main]: {
    modules: ['@ali/ide-editor'],
  },
  // [SlotLocation.bottom]: {
  //   modules: ['@ali/ide-output', '@ali/ide-markers'],
  // },
  [SlotLocation.statusBar]: {
    modules: [''],
    // modules: ['@ali/ide-status-bar'],
  },
};

// 界面布局组件
const LayoutComponent = () => (
  <BoxPanel direction="top-to-bottom">
    <SplitPanel overflow="hidden" id="main-horizontal" flex={1}>
      <SlotRenderer slot="left" minResize={220} minSize={49} />
      <SplitPanel id="main-vertical" minResize={300} flexGrow={1} direction="top-to-bottom">
        <SlotRenderer flex={2} flexGrow={1} minResize={200} slot="main" />
        {/* <SlotRenderer flex={1} minResize={160} slot="bottom" /> */}
      </SplitPanel>
    </SplitPanel>
    <SlotRenderer slot="statusBar" />
  </BoxPanel>
);

interface GraphInsightIDEProps {
  id: string;
  readOnly: boolean;
  mode: string;
  appRef: any;
  codeChange: (filepath: string, source: string) => void;
}

const GraphInsightIDE: React.FC<GraphInsightIDEProps> = props => {
  const { id, readOnly, mode, appRef, codeChange } = props;

  const app = useRef(null);

  let defaultPreferences = {
    'general.theme': 'ide-dark',
    'editor.previewMode': false,
    'editor.forceReadOnly': readOnly,
  };

  return (
    <AppRenderer
      ref={appRef}
      id={{ id }}
      onLoad={_app => {
        app.current = _app;
      }}
      appConfig={{
        workspaceDir: `${id}/gi-workerspace`,
        layoutConfig,
        layoutComponent: LayoutComponent,
        defaultPreferences,
        panelSizes: {
          [SlotLocation.left]: 220,
        },
        extensionMetadata: readOnly ? [] : [html, css, typescript, json],
      }}
      runtimeConfig={{
        biz: 'gi',
        disableModifyFileTree: true,
        defaultOpenFile: mode,
        workspace: {
          filesystem: {
            fs: 'OverlayFS',
            options: {
              writable: { fs: 'InMemory' },
              readable: {
                fs: 'DynamicRequest',
                options: {
                  async readDirectory(p: string) {
                    // TODO: projectName 和 branchName 需要从组件里面读取
                    const result = await getFileDirectory({
                      projectName: 'test_legend',
                      branchName: 'master',
                      path: p.slice(1),
                    });
                    const { data, success } = result;
                    if (!success) {
                      return null;
                    }

                    if (p === '/') {
                      return data[p];
                    }
                    return data[p.slice(1)];
                  },
                  async readFile(p) {
                    // TODO: projectName 和 branchName 需要从组件里面读取
                    const res = await getFileBlob({
                      projectName: 'test_legend',
                      branchName: 'master',
                      path: p.slice(1),
                    });
                    const { data, success } = res;
                    if (!success) {
                      return null;
                    }

                    return data.data;
                  },
                },
              },
            },
          },
          onDidSaveTextDocument(e) {
            const { filepath, content } = e;
            if (codeChange) {
              codeChange(filepath, content);
            }
          },
        },
        // 隐藏左侧 tabbar
        hideLeftTabBar: true,
        // 注销左侧下方的 bar，此时设置按钮会被隐藏
        unregisterActivityBarExtra: true,
      }}
    />
  );
};

export default GraphInsightIDE;
