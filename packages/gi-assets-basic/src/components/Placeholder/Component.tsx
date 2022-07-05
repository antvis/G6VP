import { useContext } from '@alipay/graphinsight';
import * as React from 'react';
import './index.less';

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
  if (largeGraphData) {
    return (
      <div className="gi-placeholader" style={{ width: `${width}px` }}>
        {img && <img src={img} width={width} />}
        当前载入图的节点规模已经超出「{largeGraphLimit}
        」限制，建议您在资产中心中加载「大图概览」资产，筛选子图数据 或 调整限制规模
      </div>
    );
  }

  if (!hasNodes) {
    return (
      <div className="gi-placeholader" style={{ width: `${width}px` }}>
        {img && <img src={img} width={width} />}
        {text}
      </div>
    );
  }

  return null;
};

export default Placeholder;
