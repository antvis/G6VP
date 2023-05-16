import React from 'react';
const MyLayout = props => {
  const { containers, children } = props;

  console.log('containers', containers);

  return (
    <div
      style={{
        background: 'red',
        padding: '20px',
        height: 'calc(100vh)',
      }}
    >
      <div
        style={{ background: 'green', width: '400px', height: '300px', display: 'inline-block', verticalAlign: 'top' }}
      >
         自定义布局 left
      </div>
      <div
        style={{
          background: 'blue',
          width: 'calc(100% - 400px)',
          height: '300px',
          display: 'inline-block',
          verticalAlign: 'top',
        }}
      >
         自定义布局 right
      </div>
      <div style={{ height: '500px' }}>{children}</div>
    </div>
  );
};

export default MyLayout;
