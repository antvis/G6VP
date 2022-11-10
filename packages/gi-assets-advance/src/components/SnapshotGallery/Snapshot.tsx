import { DeleteOutlined, ZoomInOutlined } from '@ant-design/icons';
import { useContext } from '@antv/gi-sdk';
import { Button, Card } from 'antd';
import React from 'react';
import { animated, useSpring } from 'react-spring';
import { IHistoryObj } from './typing';

export interface ISnapShotProps {
  id: string;
  historyObj: IHistoryObj;
  deleteSnapShot: (id: string) => void;
}

export interface IState {
  isPreview: boolean;
}

const Snapshot: React.FC<ISnapShotProps> = props => {
  const { id, historyObj, deleteSnapShot } = props;
  const { graphData, imgURL } = historyObj;

  const { updateContext, graph } = useContext();

  const onClickSnapshot = graphData => {
    updateContext(draft => {
      draft.data = graphData;
      //draft.layout.type = 'preset';
    });
  };

  const graphWidth = graph.getWidth();
  const graphHeight = graph.getHeight();

  const style = useSpring({
    from: {
      width: `${graphWidth}px`,
      height: `${graphHeight}px`,
    },
    to: {
      width: '100px',
      height: '60px',
    },
  });

  const stopPropagation = e => {
    e.stopPropagation();
  };

  return (
    <div key={id} className="gi-gallery-img-container">
      <Card
        hoverable
        onClick={() => onClickSnapshot(graphData)}
        cover={<animated.img style={{ ...style }} src={imgURL} alt="画廊图片" className="gi-gallery-img" />}
        bodyStyle={{ width: 100 }}
      >
        <div onClick={stopPropagation}>
          <Button onClick={() => deleteSnapShot(id)} icon={<DeleteOutlined />} />
          {/* 用于预览图片：暂未实现 */}
          <Button icon={<ZoomInOutlined />} />
        </div>
      </Card>
    </div>
  );
};

export default Snapshot;
