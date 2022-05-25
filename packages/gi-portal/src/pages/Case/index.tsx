import React, { useState } from 'react';
import './index.less';

type Status = 'solution' | 'money' | 'other';

const Case: React.FC = () => {
  const [status, setStatus] = useState('solution');
  const list = [
    {
      key: 'solution',
      src: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*JUMBR6Z2xTQAAAAAAAAAAAAAARQnAQ',
      title: '图可视分析解决方案',
    },
    {
      key: 'money',
      src: '',
      title: '反洗钱',
    },
    {
      key: 'other',
      src: '',
      title: 'Loading',
    },
  ];
  return (
    <div className="gi-case">
      <div className="gi-case-top">
        {list.map(item => (
          <div
            className={`gi-case-top-item ${status === item.key && 'gi-case-top-item-active'}`}
            onClick={() => setStatus(item.key)}
          >
            {item.src ? <img src={item.src} alt={item.title} /> : item.title}
          </div>
        ))}
      </div>
      <div className="gi-case-bottom">
        {status === 'solution' && (
          <embed
            title="visualization for graph "
            height="1000px"
            width="100%"
            src="https://gw.alipayobjects.com/os/bmw-prod/c8ddbda8-c742-4c11-9c68-3783dd5954b9.pdf"
            type="application/pdf"
          />
        )}
      </div>
    </div>
  );
};

export default Case;
