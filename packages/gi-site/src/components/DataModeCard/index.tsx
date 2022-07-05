import { DatabaseOutlined } from '@ant-design/icons';
import { Button, Popover, Select, Typography } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';
const { Option } = Select;
type ServerEnv = 'ONLINE' | 'LOCAL';
type Props = {
  changeDataModeCallback?: (env: ServerEnv) => void;
};
const EnvInfo = () => {
  return (
    <div style={{ width: '400px' }}>
      GraphInsight 平台提供两种环境选择：
      <br />
      「本地环境」：
      <Typography.Text type="success">所有的数据（上传数据，操作数据）均存在你的浏览器本地。</Typography.Text>
      (技术同学可以 审查元素，查看Storage/indexDB) 因此不涉及数据安全问题 ，这个环境，也是开放对外用户的唯一环境。
      <br />
      「线上环境」：
      <Typography.Text type="success">使用线上环境意味着你制作画布可以在线查看，也可以分享给其他人。</Typography.Text>
      （我们会启用蚂蚁内部服务，包括鉴权服务/ GraphScope 引擎环境。预计8月份上线）
    </div>
  );
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
  const isOnline = localStorage.getItem('userInfo');
  const modeList = isOnline
    ? [
        { img: '', value: 'LOCAL', label: '本地环境' },
        { img: '', value: 'ONLINE', label: '在线环境' },
      ]
    : [{ img: '', value: 'LOCAL', label: '本地环境' }];
  const { env, visible } = state;
  const handleChange = (value: ServerEnv) => {
    localStorage.setItem('GI_SERVER_ENV', value);
    location.reload();
  };
  const handleVisibleChange = val => {
    updateState(draft => {
      draft.visible = val;
    });
    if (!localStorage.getItem('GI_SERVER_ENV')) {
      localStorage.setItem('GI_SERVER_ENV', 'LOCAL');
    }
  };
  return (
    <Popover
      content={<EnvInfo />}
      title="环境说明"
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <Button icon={<DatabaseOutlined />} style={{ padding: '0px 2px 0px 8px' }}>
        <Select defaultValue={env} style={{ width: 100 }} bordered={false} onChange={handleChange}>
          {modeList.map(c => {
            return (
              <Option key={c.value} value={c.value}>
                {c.label}
              </Option>
            );
          })}
        </Select>
      </Button>
    </Popover>
  );
};
export default DataModeCard;
