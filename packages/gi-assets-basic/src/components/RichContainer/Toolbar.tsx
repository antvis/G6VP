import { Icon } from '@antv/gi-sdk';
import { Button, Divider, Tooltip } from 'antd';
import React, { memo } from 'react';
export interface ToolbarProps {
  /** 分类的标题 */
  title: string;
  /** 分类信息 */
  options: any;
  /** 当前激活的值 */
  value: string;
  /** 触发函数 */
  onChange: (id: string) => void;
  /** 是否展示文本 */
  displayText?: boolean;
  /** Context.HAS_GRAPH */
  HAS_GRAPH: boolean;
}
const ActiveButtonStyle: React.CSSProperties = {
  background: 'var(--background-color)',
  borderColor: 'var(--background-color)',
  color: 'var(--text-color)',
};
const Toolbar = (props: ToolbarProps) => {
  const { title, options, value, onChange, displayText, HAS_GRAPH } = props;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Divider type="vertical" />
      <span style={{ padding: '0px 8px 0px 6px', color: '#98989D' }}>{title}</span>
      {options.map(item => {
        const isActive = value === item.id;
        const { id, props: itemProps, component: ItemComponent } = item;
        const { GIAC_CONTENT } = itemProps;
        const title = GIAC_CONTENT ? GIAC_CONTENT.title : 'EMPTY';
        const buttonType = isActive ? 'primary' : 'text';

        if (!HAS_GRAPH) {
          return null;
        }

        if (!GIAC_CONTENT) {
          return <ItemComponent {...itemProps} />;
        }
        const { icon, tooltipColor = 'var(--primary-color)' } = GIAC_CONTENT || {};

        return (
          <Tooltip title={title} color={tooltipColor}>
            <Button
              type={buttonType}
              icon={<Icon type={icon} />}
              key={id}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 32,
                marginRight: 4,
                ...(isActive ? ActiveButtonStyle : {}),
              }}
              onClick={() => {
                onChange(id);
              }}
            >
              {displayText ? title : null}
            </Button>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default memo(Toolbar);
