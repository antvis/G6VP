import { Icon } from '@antv/gi-sdk';
import { Tag } from 'antd';
import * as React from 'react';

interface CartContentProps {}

const CartContent: React.FunctionComponent<CartContentProps> = props => {
  const res = JSON.parse(localStorage.getItem('GI_CART_LIST') || '{}');
  const list = Object.values(res).filter((c: any) => c.checked);

  return (
    <div>
      <ul>
        {list.map(item => {
          const { id, name, desc, icon } = item as any;
          return (
            <li key={id} style={{ listStyle: 'none' }}>
              {
                <Tag>
                  <Icon type={icon} />
                </Tag>
              }
              <Tag>
                {name} | {id}
              </Tag>
              {desc}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CartContent;
