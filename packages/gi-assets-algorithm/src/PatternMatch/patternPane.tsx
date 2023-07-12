import { DownOutlined } from '@ant-design/icons';
import { IEdgeSchema, useContext } from '@antv/gi-sdk';
import Graphin, { Behaviors, GraphinData } from '@antv/graphin';
import { Dropdown, Empty, Menu, message, Tooltip, Upload } from 'antd';
import React, { useEffect, useMemo, useRef } from 'react';
import Util from '../utils';
import './index.less';
import { formatData } from './util';
import $i18n from '../i18n';

const { exportGraphData } = Util;

const { ClickSelect } = Behaviors;
interface Props {
  id: string;
  data?: GraphinData | null;
  schemaEdgeMap?: { [key: string]: IEdgeSchema };
  editPattern: (patternId: string) => void;
  extractPattern?: (patternId: string) => void;
  importData?: (data: object, patternId: string) => void;
}

const PatternPane: React.FC<Props> = ({ id, data, schemaEdgeMap, editPattern, extractPattern, importData }) => {
  const { config } = useContext();
  const graphRef = useRef();

  // 数据发生变化，fitView
  useEffect(() => {
    const graph = (graphRef?.current as any)?.graph;
    if (graph && !graph.destroyed) {
      graph.once('afterlayout', e => {
        graph.fitView();
      });
      graph.fitView();
      graph.get('canvas').set('localRefresh', false);
    }
  }, [data]);

  useEffect(() => {
    const graph = (graphRef?.current as any)?.graph;
    if (graph && !graph.destroyed) {
      graph.changeSize(456, 246);
    }
  }, [(graphRef?.current as any)?.graph?.get('width'), (graphRef?.current as any)?.graph?.get('height')]);

  /**
   * 下载模式数据到本地 json 文件，方便下次上传
   */
  const downloadPatternData = () => {
    const graph = (graphRef?.current as any)?.graph;
    if (graph && !graph.destroyed) {
      exportGraphData(graph.save(), 'pattern-data');
    }
  };

  /**
   * 导入 json 图数据
   * @param result
   * @returns
   */
  const importPattern = result => {
    const { file: fileInfo } = result;
    const { status, type, name, originFileObj: file } = fileInfo || {};
    if (status !== 'uploading') {
      return;
    }
    if (type === 'json' || name.includes('.json')) {
      const fReader = new FileReader();
      fReader.onload = () => {
        if (typeof fReader.result === 'string') {
          const data = JSON.parse(fReader.result);
          importData?.(data, id);
        }
      };
      fReader.readAsText(file);
    } else {
      message.error(
        $i18n.get({
          id: 'gi-assets-algorithm.src.PatternMatch.patternPane.PleaseUploadDataInJson',
          dm: '请上传 JSON 格式的数据',
        }),
      );
    }
  };

  const buildPatternMenuItems = [
    <Menu.Item onClick={() => editPattern?.(id)}>
      {$i18n.get({ id: 'gi-assets-algorithm.src.PatternMatch.patternPane.EditMode', dm: '编辑模式' })}
    </Menu.Item>,
    <Menu.Item onClick={() => extractPattern?.(id)}>
      <Tooltip
        title={$i18n.get({
          id: 'gi-assets-algorithm.src.PatternMatch.patternPane.DragOrClickTheContent',
          dm: '从主图上拖拽圈选或点选内容并抽取为模式',
        })}
      >
        {$i18n.get({ id: 'gi-assets-algorithm.src.PatternMatch.patternPane.ExtractionMode', dm: '提取模式' })}
      </Tooltip>
    </Menu.Item>,
    <Menu.Item>
      <Upload accept=".json,.txt" onChange={importPattern} fileList={[]}>
        {$i18n.get({ id: 'gi-assets-algorithm.src.PatternMatch.patternPane.ImportMode', dm: '导入模式' })}
      </Upload>
    </Menu.Item>,
  ];

  const modifyPatternMenuItems = buildPatternMenuItems.concat(
    <Menu.Item onClick={downloadPatternData}>
      {$i18n.get({ id: 'gi-assets-algorithm.src.PatternMatch.patternPane.DownloadMode', dm: '下载模式' })}
    </Menu.Item>,
  );

  const buildPatternMenu = <Menu>{buildPatternMenuItems}</Menu>;
  const modifyPatternMenu = <Menu>{modifyPatternMenuItems}</Menu>;

  const graphData = useMemo(() => (data ? formatData(data, config, schemaEdgeMap) : { nodes: [], edges: [] }), [data]);

  return (
    <div className="kg-pattern-pane-content">
      {data ? (
        <div className="kg-pattern-pane-graph">
          <Dropdown overlay={modifyPatternMenu} className="kg-pattern-pane-edit">
            <a onClick={e => e.preventDefault()}>
              {$i18n.get({ id: 'gi-assets-algorithm.src.PatternMatch.patternPane.BuildMode', dm: '构建模式' })}
              <DownOutlined />
            </a>
          </Dropdown>
          <Graphin
            width={388}
            height={246}
            data={graphData}
            ref={graphRef as any}
            animate={false}
            minZoom={0.001}
            fitView={true}
          >
            <ClickSelect disabled />
          </Graphin>
        </div>
      ) : (
        <Empty
          className="kg-pattern-empty"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span>
              {$i18n.get({ id: 'gi-assets-algorithm.src.PatternMatch.patternPane.NoMode', dm: '暂无模式' })}

              <Dropdown overlay={buildPatternMenu}>
                <a onClick={e => e.preventDefault()}>
                  {$i18n.get({ id: 'gi-assets-algorithm.src.PatternMatch.patternPane.BuildMode', dm: '构建模式' })}
                  <DownOutlined />
                </a>
              </Dropdown>
            </span>
          }
        />
      )}
    </div>
  );
};

export default PatternPane;
