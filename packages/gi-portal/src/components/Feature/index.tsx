import * as React from 'react';
import './index.less';

interface FeatureProps {
  reverse: boolean;
  image: string;
  title: string;
  description: string;
}

const Feature: React.FunctionComponent<FeatureProps> = props => {
  const { reverse, image, title, description } = props;

  return (
    <div
      className="gi-feature"
      style={{
        flexDirection: reverse ? 'row-reverse' : 'row',
      }}
    >
      <div className="gi-feature-image">{<img src={image} alt="" />}</div>
      <div className="gi-feature-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Feature;
