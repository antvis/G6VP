import { FieldTimeOutlined } from '@ant-design/icons';
import { Button, Divider, Tooltip } from 'antd';
import * as React from 'react';
import ReactDOM from 'react-dom';
import './index.less';

export interface TimelineProps {
  visible: boolean;
  color: string;
  hasDivider: boolean;
  defaultVisible: boolean;
}

const Timeline: React.FunctionComponent<TimelineProps> = props => {
  const { defaultVisible, color, hasDivider } = props;
  const [visible, setVisible] = React.useState(defaultVisible);
  React.useEffect(() => {
    setVisible(defaultVisible);
  }, [defaultVisible]);
  const handleClick = () => {
    setVisible(!visible);
  };
  const TimelineCore = (
    <div
      className="timeline"
      style={{
        position: 'absolute',
        bottom: '0px',
        right: '0px',
        left: '0px',
        height: '300px',
        background: 'green',
      }}
    >
      <div className="timeline-core">timeline</div>
    </div>
  );

  return (
    <div>
      <div onClick={handleClick} className="gi-component-timeline">
        <Tooltip title="时序分析" color={color} key={color}>
          <Button type="text" icon={<FieldTimeOutlined />}></Button>
        </Tooltip>
        {hasDivider && <Divider type="vertical" />}
      </div>
      {visible &&
        //@ts-ignore
        ReactDOM.createPortal(TimelineCore, document.getElementById('graphin-container'))}
    </div>
  );
};

export default Timeline;
