import GISDK, { useContext } from '@antv/gi-sdk';
import * as React from 'react';
import ReactDOM from 'react-dom';
import useRedoUndo from '../hooks/useRedoUndo';
import { getStyles } from '../Sheetbar/utils';
import { useImmer } from 'use-immer';
import { CheckCircleFilled, DownOutlined, PictureOutlined, UpOutlined } from '@ant-design/icons';
import { Col, Modal, Popover, Timeline } from 'antd';
import { ColorMap, LabelMap, getRecordContent, getRecordsFromHistory } from './util';
import './index.less';
import FlowGraph from './FlowGraph';

export interface TemplateModalProps {
  open: boolean;
  handleSave: () => void;
  handleClose: () => void;
  urlMap: { [key: string]: string };
}

const TemplateModal: React.FC<TemplateModalProps> = props => {
  const { GISDK_ID, history, graph } = useContext();
  const { open, handleSave, handleClose, urlMap } = props;

  const [state, updateState] = useImmer({
    checkedRecordIds: [] as string[],
  });

  const { checkedRecordIds = [] } = state;

  const handleCheck = id => {
    console.log('chekcing', id);
    updateState(draft => {
      const newArr = [...checkedRecordIds];
      if (newArr.includes(id)) {
        const idx = newArr.indexOf(id);
        console.log('splicing', newArr, id, idx);
        newArr.splice(idx, 1);
        draft.checkedRecordIds = newArr;
      } else {
        draft.checkedRecordIds = newArr.concat(id);
      }
    });
  };

  return (
    <Modal title="沉淀分析历史" width="70%" open={open} onOk={handleSave} onCancel={handleClose}>
      <div className="gi-history-modal-wrapper">
        <div className="gi-history-modal-timeline-wrapper">
          <h3>操作历史</h3>
          <span className="gi-history-modal-timeline-line" />
          <Timeline>
            {history?.map(item => {
              const { id, type, subType, statement, timestamp } = item;
              const date = new Date(timestamp);
              return (
                <Timeline.Item
                  color={ColorMap[type]}
                  dot={
                    checkedRecordIds.includes(id) ? (
                      <CheckCircleFilled style={{ fontSize: '16px' }} onClick={() => handleCheck(id)} />
                    ) : (
                      <a
                        className="gi-history-modal-timeline-dot-uncheck"
                        style={{
                          border: `2px solid ${ColorMap[type]}`,
                          borderRadius: '50%',
                          width: '16px',
                          height: '16px',
                          cursor: 'pointer',
                          display: 'block',
                        }}
                        onClick={() => handleCheck(id)}
                      />
                    )
                  }
                >
                  <span className="gi-analysis-history-statement">
                    {LabelMap[type]} ({subType}): {statement}
                  </span>
                  <span className="gi-analysis-history-time">
                    {date.toLocaleDateString()} {date.toLocaleTimeString()}
                  </span>
                  {urlMap[id] ? (
                    <Popover
                      placement="right"
                      style={{ width: 'fit-content', height: 'fit-content' }}
                      content={<img src={urlMap[id]} style={{ width: '300px' }} />}
                    >
                      <PictureOutlined className="gi-analysis-history-screenshot-icon" />
                    </Popover>
                  ) : (
                    ''
                  )}
                </Timeline.Item>
              );
            })}
          </Timeline>
        </div>
        <div className="gi-history-modal-graph-wrapper">
          <h3>分析链路模版</h3>
          <div className="gi-history-modal-graph">
            <FlowGraph nodeIds={checkedRecordIds} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TemplateModal;
