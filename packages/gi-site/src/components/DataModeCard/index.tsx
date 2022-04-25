import { InfoCircleOutlined } from '@ant-design/icons';
import { Popover, Select } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';
const { Option } = Select;
type ServerEnv = 'ONLINE' | 'LOCAL';
type Props = {
  changeDataModeCallback?: (env: ServerEnv) => void;
};
const EnvInfo = () => {
  return <div>env info</div>;
};
const DataModeCard: React.FC<Props> = ({ changeDataModeCallback }) => {
  // 默认本地
  const defaultValue: ServerEnv = localStorage.getItem('GI_SERVER_ENV') === 'ONLINE' ? 'ONLINE' : 'LOCAL';
  const [state, updateState] = useImmer<{
    env: ServerEnv;
    visible: boolean;
  }>({
    env: defaultValue, // 该页面状态
    visible: !localStorage.getItem('GI_SERVER_ENV'), // 新用户第一次打开时没有该值，则打开弹窗
  });

  const modeList = [
    { img: '', value: 'LOCAL', label: '本地环境' },
    { img: '', value: 'ONLINE', label: '在线环境' },
  ];
  const { env, visible } = state;
  const handleChange = (value: ServerEnv) => {
    localStorage.setItem('GI_SERVER_ENV', value);
    location.reload();
  };
  const handleVisibleChange = val => {
    updateState(draft => {
      draft.visible = val;
    });
  };
  return (
    <div>
      <Popover
        content={<EnvInfo />}
        title="环境说明"
        trigger="click"
        visible={visible}
        onVisibleChange={handleVisibleChange}
      >
        <InfoCircleOutlined />
      </Popover>
      <Select defaultValue={env} style={{ width: 100 }} bordered={false} onChange={handleChange}>
        {modeList.map(c => {
          return (
            <Option key={c.value} value={c.value}>
              {c.label}
            </Option>
          );
        })}
      </Select>
    </div>
  );
};
export default DataModeCard;
