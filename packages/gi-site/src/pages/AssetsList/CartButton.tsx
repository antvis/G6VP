import { ShoppingCartOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import * as React from 'react';
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
  const { id } = data;
  const prev = JSON.parse(localStorage.getItem('GI_CART_LIST') || '{}');
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
  const title = value ? '已加入' : '加入选购';
  const type = value ? 'primary' : 'text';
  const handleClick = () => {
    setValue(data, !value);
    setState({ checked: !value });
  };
  return (
    <Button type={type} icon={<ShoppingCartOutlined />} onClick={handleClick}>
      {title}
    </Button>
  );
};

export default CartButton;
