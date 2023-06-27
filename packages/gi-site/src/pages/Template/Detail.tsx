import * as React from 'react';
import $i18n from '../../i18n';

interface DetailProps {}

const styles = {
  container: {
    borderRadius: '8px',
    background: 'var(--background-color-transparent)',
    padding: '24px',
  },
};

const Detail: React.FunctionComponent<DetailProps> = props => {
  return (
    <div style={styles.container}>
      {$i18n.get({ id: 'gi-site.pages.Template.Detail.UnderConstruction', dm: '正在建设中...' })}
    </div>
  );
};

export default Detail;
