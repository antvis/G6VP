import * as React from 'react';

interface DetailProps {}

const styles = {
  container: {
    borderRadius: '8px',
    background: 'var(--background-color-transparent)',
    padding: '24px',
  },
};

const Detail: React.FunctionComponent<DetailProps> = props => {
  return <div style={styles.container}>正在建设中... </div>;
};

export default Detail;
