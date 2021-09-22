import { FieldTimeOutlined } from '@ant-design/icons';
import * as React from 'react';
import ReactDOM from 'react-dom';
import './index.less';

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
      <div onClick={handleClick} className="gi-component-timeline">
        <div>
          <FieldTimeOutlined />
        </div>
        <div> 时序分析</div>
      </div>
      {visible &&
        //@ts-ignore
        ReactDOM.createPortal(TimelineCore, document.getElementById('graphin-container'))}
    </div>
  );
};

export default Timeline;
