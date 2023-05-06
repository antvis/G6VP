import { Button, Input, Menu, Modal } from 'antd';
import React from 'react';
import { Icon as MyIcon } from '../../Icon';
import font from '../../Icon/font.json';
const { Search } = Input;
interface IconContentProps {
  activeCategory: string;
  activeIcon: string;
  onChange: (icon: string) => void;
  updateState: (state: any) => void;
}

const basic = [
  'user',
  'team',
  'location',
  'file',
  'home',
  'bank',
  'car',
  'shop',
  'comment',
  'company',
  'plus',
  'minus',
  'pause',
  'contacts',
];
const device = [
  'desktop',
  'wifi',
  'phone',
  'whatsapp',
  'android-fill',
  'apple-fill',
  'appstore add',
  'carryout',
  'solution',
];

const company = [
  'alipay',
  'taobao',
  'amazon',
  'yuque',
  'alibaba',
  'github-fill',
  'medium',
  'google',
  'windows',
  'zhihu',
];
const badges = [
  'pushpin',
  'star',
  'attachment',
  'fullscreen',
  'fullscreen-exit',
  'tags',
  'like',
  'unlike',
  'rest',
  'question',
  'check',
  'close',
  'infomation',
  'sound',
  'lock',
  'unlock',
];
const getIconOptions = (icons: string[]) => {
  return icons.map(icon => {
    return {
      key: icon,
      value: `icon-${icon}`,
    };
  });
};
const category = [
  {
    id: 'basic',
    name: '基础',
    options: getIconOptions(basic),
  },
  {
    id: 'device',
    name: '设备',
    options: getIconOptions(device),
  },
  {
    id: 'company',
    name: '公司',
    options: getIconOptions(company),
  },
  {
    id: 'badges',
    name: '徽标',
    options: getIconOptions(badges),
  },
];

const allIconOptions = font.glyphs.map(item => {
  return {
    key: item.font_class,
    value: `icon-${item.font_class}`,
  };
});

const IconContent: React.FunctionComponent<IconContentProps> = props => {
  const { onChange, updateState, activeCategory, activeIcon } = props;
  const onSearch = value => console.log(value);
  const [open, setOpen] = React.useState(false);

  const onChangeCategory = ({ key }) => {
    updateState(preState => {
      return {
        ...preState,
        activeCategory: key,
      };
    });
  };
  const handleChangeIcon = ({ key }) => {
    updateState(preState => {
      return {
        ...preState,
        activeIcon: key,
      };
    });
    if (onChange) {
      onChange(key);
    }
  };

  const options = category.find(item => item.id === activeCategory)?.options;
  const handleClick = () => {
    setOpen(true);
  };
  return (
    <div>
      <>
        <Button size="small" onClick={handleClick} type="primary" style={{ width: '100%', marginBottom: '8px' }}>
          查看全部图标
        </Button>
      </>
      {/* <Divider /> */}
      <div className="gi-icon-picker">
        {/* @ts-ignore */}
        <Menu
          className="gi-icon-picker-menu"
          defaultSelectedKeys={['basic']}
          defaultOpenKeys={['basic']}
          mode="vertical"
          onClick={onChangeCategory}
        >
          {category.map(c => {
            // @ts-ignore
            return <Menu.Item key={c.id}>{c.name}</Menu.Item>;
          })}
        </Menu>
        <div className="gi-icon-picker-content">
          {options?.map(item => {
            return (
              <MyIcon
                type={item.value}
                onClick={() => handleChangeIcon({ key: item.key })}
                style={{
                  margin: '6px',
                  fontSize: '22px',
                  cursor: 'pointer',
                  color: activeIcon === item.key ? '#2f54e0' : '#000',
                }}
              />
            );
          })}
        </div>
      </div>
      <Modal
        width={'100%'}
        title="全部图标"
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        onOk={() => {
          setOpen(false);
        }}
      >
        <div>
          {allIconOptions?.map(item => {
            return (
              <MyIcon
                type={item.value}
                onClick={() => {
                  handleChangeIcon({ key: item.key });
                  setOpen(false);
                }}
                style={{
                  margin: '6px',
                  fontSize: '22px',
                  cursor: 'pointer',
                  color: activeIcon === item.key ? '#2f54e0' : '#000',
                }}
              />
            );
          })}
        </div>
      </Modal>
    </div>
  );
};

export default IconContent;
