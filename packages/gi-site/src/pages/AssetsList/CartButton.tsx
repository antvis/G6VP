import { ShoppingCartOutlined } from '@ant-design/icons';
import { AssetInfo } from '@antv/gi-sdk';
import { Button } from 'antd';
import * as React from 'react';
import $i18n from '../../i18n';
interface CartButtonProps {
  data: any;
}

const getValue = data => {
  const { id } = data;
  const list = JSON.parse(localStorage.getItem('GI_CART_LIST') || '{}');
  const value = list[id];
  if (value) {
    return value.checked;
  }
  localStorage.setItem(
    'GI_CART_LIST',
    JSON.stringify({
      ...list,
      [id]: { ...data, checked: false },
    }),
  );
  return false;
};

const setValue = (data, checked) => {
  const { id, type } = data;
  console.log('type', type, id);
  const prev = JSON.parse(localStorage.getItem('GI_CART_LIST') || '{}') as Record<string, AssetInfo>;

  /**
   * start
   * 这里面有一段业务逻辑：GICC_LAYOUT 类型的资产是互斥的，只能有一个Checked
   * */
  if (type === 'GICC_LAYOUT') {
    Object.values(prev).forEach(item => {
      if (item.type === 'GICC_LAYOUT') {
        prev[item.id]['checked'] = false;
      }
    });
  }
  /** end */
  localStorage.setItem(
    'GI_CART_LIST',
    JSON.stringify({
      ...prev,
      [id]: { ...data, checked },
    }),
  );
};

const CartButton: React.FunctionComponent<CartButtonProps> = props => {
  const { data } = props;
  const value = getValue(data);
  const [_state, setState] = React.useState({ checked: value });
  const title = value
    ? $i18n.get({ id: 'gi-site.pages.AssetsList.CartButton.Purchased', dm: '已选购' })
    : $i18n.get({ id: 'gi-site.pages.AssetsList.CartButton.AddToPurchase', dm: '加入选购' });
  const type = value ? 'primary' : 'text';
  const handleClick = () => {
    setValue(data, !value);
    setState({ checked: !value });
  };
  return (
    <Button type={type} icon={<ShoppingCartOutlined />} onClick={handleClick} size="small">
      {title}
    </Button>
  );
};

export default CartButton;
