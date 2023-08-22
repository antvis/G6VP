import { useContext } from '@antv/gi-sdk';
import React, { memo } from 'react';
import $i18n from '../../i18n';
import './index.less';

export interface LoadingProps {
  img?: string;
  text?: string;
  textColor: string;
  spacing: number;
  width: number;
}

const Placeholder: React.FunctionComponent<LoadingProps> = props => {
  const context = useContext();
  const {
    width = 200,
    img = 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*1BGfQ78mW4kAAAAAAAAAAAAADmJ7AQ/original',
    text,
    spacing,
    textColor,
  } = props;

  const { data, largeGraphData, largeGraphLimit } = context;
  const hasNodes = data && data.nodes && data.nodes.length !== 0;

  if (hasNodes) {
    return null;
  }
  if (largeGraphData) {
    return (
      <div className="gi-placeholder" style={{ width: `${width}px` }}>
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
    <div className="gi-placeholder" style={{ width: `${width}px`, gap: spacing }}>
      {img && (
        <div className="image-wrapper">
          <img src={img} width={width} />
        </div>
      )}
      <span style={{ color: textColor }}>{text}</span>
    </div>
  );
};

export default memo(Placeholder);
