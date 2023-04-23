import GISDK, { useContext } from '@antv/gi-sdk';
import * as React from 'react';
import ReactDOM from 'react-dom';
import useRedoUndo from '../hooks/useRedoUndo';
import { getStyles } from '../Sheetbar/utils';
import { useImmer } from 'use-immer';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import { getRecordContent, getRecordsFromHistory } from './util';
import './index.less';

export interface AnalysisHistoryProps {
  height: number;
  placement: 'top' | 'bottom';
}

const AnalysisHistory: React.FC<AnalysisHistoryProps> = props => {
  const { GISDK_ID, history, graph } = useContext();
  // const { redo, undo, redoStack, undoStack } = useRedoUndo();
  const { height, placement } = props;

  const [state, updateState] = useImmer({
    collapsed: true,
    records: '',
    urlMap: {},
  });

  const { collapsed, urlMap } = state;

  const GISDK_DOM = document.getElementById(`${GISDK_ID}-container`) as HTMLDivElement;
  const GISDK_PARENT_DOM = GISDK_DOM.parentElement as HTMLDivElement;

  const toggleCollapse = value => {
    updateState(draft => {
      draft.collapsed = value;
    });
  };

  const handleTemplatefy = () => {
    // open modal
  };

  React.useEffect(() => {
    const newHistory = history?.[history.length - 1];
    updateState(draft => {
      if (newHistory) {
        // TODO: 截图时机
        const imgURL = graph.toDataURL('image/jpeg', '#fff');
        const { id } = newHistory;
        draft.urlMap[id] = imgURL;
      }
    });
  }, [history]);

  const styles = getStyles(height, placement);
  const style = collapsed
    ? styles.sheetbar
    : {
        ...styles.sheetbar,
        height: '300px',
      };

  const lastHistory = history?.[history.length - 1];
  const HistoryFooterComponent = (
    <div style={{ ...style, display: 'unset' }} className="gi-history-footer">
      {collapsed ? (
        <Row justify="space-between" style={{ width: '100%' }}>
          <Col style={{ display: 'inline-flex' }}>
            <UpOutlined onClick={() => toggleCollapse(false)} style={{ marginRight: '8px', marginTop: '12px' }} />
            {lastHistory ? getRecordContent(lastHistory, urlMap[lastHistory.id]) : <span>暂无记录</span>}
          </Col>
          <Col>
            <a onClick={handleTemplatefy}>沉淀分析历史</a>
          </Col>
        </Row>
      ) : (
        <>
          <Row justify="space-between" style={{ width: '100%' }}>
            <Col>
              <DownOutlined onClick={() => toggleCollapse(true)} />
              <span style={{ marginLeft: '4px' }}>历史记录列表</span>
            </Col>
            <Col>
              <a onClick={handleTemplatefy}>沉淀分析历史</a>
            </Col>
          </Row>
          <div className="gi-history-footer-item-container">{getRecordsFromHistory(history, urlMap)}</div>
        </>
      )}
    </div>
  );

  return ReactDOM.createPortal(HistoryFooterComponent, GISDK_PARENT_DOM);
};

export default AnalysisHistory;
