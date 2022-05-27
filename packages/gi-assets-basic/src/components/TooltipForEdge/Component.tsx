import { Components } from '@antv/graphin';
import * as React from 'react';
import './index.less';
const { Tooltip } = Components;
const isArray = arg => {
  return Object.prototype.toString.call(arg) === '[object Array]';
};

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

const EdgeTooltip: React.FunctionComponent<NodeTooltipProps> = props => {
  const {
    placement = 'top',
    hasArrow = true,
    mappingKeys = ['id'],
    background = '#fff',
    color = 'black',
    width,
  } = props;

  let keys = mappingKeys;
  if (!isArray(keys)) {
    keys = [];
  }

  return (
    <Tooltip bindType="edge" placement={placement} hasArrow={hasArrow} style={{ background, color, width }}>
      {renderProps => {
        const { model } = renderProps;
        console.log('model', model, keys);
        return (
          <div>
            <ul className="tooltip-content">
              {keys.map((key: string) => {
                //@ts-ignore
                const val = model.data[key];
                console.log('val', val);

                if (val !== undefined) {
                  return (
                    <li key={key}>
                      {key.toUpperCase()} : {val}
                    </li>
                  );
                }
                return null;
              })}
            </ul>
          </div>
        );
      }}
    </Tooltip>
  );
};
export default EdgeTooltip;
