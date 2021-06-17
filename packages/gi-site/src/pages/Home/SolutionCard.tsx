import React from 'react';
import { Button } from 'antd';
import styles from './index.less';

interface Iprops {
  data: List;
}

type List = {
  title: string;
  desc: string;
  url: string;
  btnText: string;
};

const SolutionCard: React.FC<Iprops> = ({ data }) => {
  const { title, desc, url, btnText } = data;

  return (
    <div className={styles.SolutionCard}>
      <div>
        <img src={url} alt="" />
      </div>
      <div style={{ padding: '23px 32px 0' }}>
        <h3>{title}</h3>
        <p>{desc}</p>
        <div>
          <Button className={styles.useBtn}>{btnText}</Button>
        </div>
      </div>
    </div>
  );
};

export default SolutionCard;
