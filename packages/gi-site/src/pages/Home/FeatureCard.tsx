import React from 'react';
import styles from './index.less';

interface Iprops {
  data: List;
}

type List = {
  title: string;
  desc: string;
  url: string;
};

const FeatureCard: React.FC<Iprops> = ({ data }) => {
  const { title, desc, url } = data;

  return (
    <div className={styles.featrueCard}>
      <div>
        <img src={url} alt="" />
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
};

export default FeatureCard;
