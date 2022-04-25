import { Components } from '@antv/graphin';
import * as React from 'react';
import './index.less';
const { Tooltip } = Components;

export type PlacementType = 'top' | 'bottom' | 'right' | 'left';

export interface NodeTooltipProps {
  placement?: PlacementType;
  hasArrow?: boolean;
  /** 映射的字段 */
  mappingKeys?: string[];
  background?: string;
  color?: string;
  width: string;
}

const NodeTooltip: React.FunctionComponent<NodeTooltipProps> = props => {
  const {
    placement = 'top',
    hasArrow = true,
    mappingKeys = ['id'],
    background = '#fff',
    color = 'black',
    width,
  } = props;

  return (
    <Tooltip bindType="node" placement={placement} hasArrow={hasArrow} style={{ background, color, width }}>
      {renderProps => {
        const { model } = renderProps;
        return (
          <div>
            <ul className="tooltip-content">
              {mappingKeys.map((key: string) => {
                return (
                  <li key={key}>
                    {/* @ts-ignore */}
                    {key.toUpperCase()} : {model.data[key]}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      }}
    </Tooltip>
  );
};
export default NodeTooltip;
