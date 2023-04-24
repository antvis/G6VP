import { LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { Input as AntdInput, Spin, Tooltip } from 'antd';
import React, { useContext, useState } from 'react';
import { ComponentContext } from '../context';

export const Input: React.FC<{
  defaultValue?: string;
}> = (props) => {
  const { onInput, clearMessages } = useContext(ComponentContext);
  const { loading, setLoading } = useContext(ComponentContext);
  const { defaultValue = '' } = props;
  const [value, setValue] = useState(defaultValue);

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <div className="input-container">
      <Spin indicator={antIcon} spinning={loading}>
        <AntdInput.TextArea
          autoSize
          placeholder="AI 助理为您服务"
          value={value}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              const valueToSend = value.trim();
              e.preventDefault();
              if (!!valueToSend) {
                if (!onInput) return;
                setLoading?.(true);
                onInput(valueToSend).then((res) => {
                  if (res) setValue('');
                  setLoading?.(false);
                });
              }
            }
          }}
          style={{ maxHeight: '60vh' }}
          onChange={(e) => setValue(e.target.value)}
        />
      </Spin>
      <Tooltip title="新对话" mouseEnterDelay={1}>
        <SyncOutlined className="new-dialog" onClick={clearMessages} />
      </Tooltip>
    </div>
  );
};
