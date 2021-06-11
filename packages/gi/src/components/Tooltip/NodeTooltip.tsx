import { Tooltip } from '@antv/graphin-components';
import * as React from 'react';
import './index.less';

export type PlacementType = 'top' | 'bottom' | 'right' | 'left';

export interface NodeTooltipProps {
  placement?: PlacementType;
  hasArrow?: boolean;
  /** 映射的字段 */
  mappingKeys?: string[];
}

const NodeTooltip: React.FunctionComponent<NodeTooltipProps> = props => {
  const { placement = 'top', hasArrow = true, mappingKeys = ['id'] } = props;
  return (
    <Tooltip bindType="node" placement={placement} hasArrow={hasArrow}>
      <Tooltip.Node>
        {model => {
          return (
            <div>
              <ul className="tooltip-content">
                {mappingKeys.map((key: string) => {
                  return (
                    <li key={key}>
                      {key.toUpperCase()} : {model.data[key]}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        }}
      </Tooltip.Node>
    </Tooltip>
  );
};
export default NodeTooltip;
