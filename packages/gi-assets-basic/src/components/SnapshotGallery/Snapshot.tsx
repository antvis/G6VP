import React from 'react';
import { Card, Button, Image } from 'antd';
import { useImmer } from 'use-immer';
import { useSpring, animated } from 'react-spring';
import { DeleteOutlined, ZoomInOutlined } from '@ant-design/icons';
import { useContext } from '@alipay/graphinsight';
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

  const [state, updateState] = useImmer<IState>({
    isPreview: false,
  });

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
      //transform: 'translate(-100px, -20px)',
      width: `${graphWidth}px`,
      height: `${graphHeight}px`,
    },
    to: {
      width: '100px',
      height: '60px',
      //transform: 'translate(0, 0)',
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
        cover={
          <animated.div style={{ ...style }}>
            <Image preview={{ visible: state.isPreview }} src={imgURL} alt="画廊图片" className="gi-gallery-img" />
          </animated.div>
        }
        bodyStyle={{ width: 100 }}
      >
        <div onClick={stopPropagation}>
          <Button onClick={() => deleteSnapShot(id)} icon={<DeleteOutlined />} />
          <Button icon={<ZoomInOutlined />} />
        </div>
      </Card>
    </div>
  );
};

export default Snapshot;
