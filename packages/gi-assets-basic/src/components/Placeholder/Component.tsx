import { useContext } from '@antv/gi-sdk';
import * as React from 'react';
import './index.less';
import $i18n from '../../i18n';

export interface LoadingProps {
  img?: string;
  text?: string;
  width: number;
}

const Placeholder: React.FunctionComponent<LoadingProps> = props => {
  const context = useContext();
  const {
    width = 200,
    img = 'https://gw.alipayobjects.com/zos/bmw-prod/db278704-6158-432e-99d2-cc5db457585d.svg',
    text,
  } = props;

  const { data, largeGraphData, largeGraphLimit } = context;
  const hasNodes = data && data.nodes && data.nodes.length !== 0;

  if (hasNodes) {
    return null;
  }
  if (largeGraphData) {
    return (
      <div className="gi-placeholader" style={{ width: `${width}px` }}>
        {img && <img src={img} width={width} />}
        {$i18n.get({
          id: 'basic.components.Placeholder.Component.TheNodeSizeOfThe',
          dm: '当前载入图的节点规模已经超出「',
        })}
        {largeGraphLimit}
        {$i18n.get({
          id: 'basic.components.Placeholder.Component.RestrictionsWeRecommendThatYou',
          dm: '」限制，建议您在资产中心中加载「大图概览」资产，筛选子图数据 或 调整限制规模',
        })}
      </div>
    );
  }
  return (
    <div className="gi-placeholader" style={{ width: `${width}px` }}>
      {img && <img src={img} width={width} />}
      {text}
    </div>
  );
};

export default Placeholder;
