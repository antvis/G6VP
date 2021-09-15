import { FieldTimeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import * as React from 'react';
import ReactDOM from 'react-dom';
export interface TimelineProps {
  visible: boolean;
}

const Timeline: React.FunctionComponent<TimelineProps> = props => {
  const { visible: defaultVisible } = props;
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
        height: '100px',
        background: 'green',
      }}
    >
      <div className="timeline-core">timeline</div>
    </div>
  );

  return (
    <div>
      <Button icon={<FieldTimeOutlined />} onClick={handleClick}>
        时序分析
      </Button>
      {visible &&
        //@ts-ignore
        ReactDOM.createPortal(TimelineCore, document.getElementById('graphin-container'))}
    </div>
  );
};

export default Timeline;
