import { Tooltip } from '@antv/graphin-components';
import * as React from 'react';
import './index.less';

export interface EdgeTooltipProps {
  /** 映射的字段 */
  mappingKeys?: string[];
}

const EdgeTooltip: React.FunctionComponent<EdgeTooltipProps> = props => {
  const { mappingKeys = ['id'] } = props;
  return (
    <Tooltip bindType="edge">
      <Tooltip.Edge>
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
      </Tooltip.Edge>
    </Tooltip>
  );
};
export default EdgeTooltip;

{
  /* <Tooltip bindType="edge">
          <Tooltip.Edge>
            {model => {
              return <span>{model.id}</span>;
            }}
          </Tooltip.Edge>
        </Tooltip> */
}
