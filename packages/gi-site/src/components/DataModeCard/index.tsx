import React from 'react';
import { useImmer } from 'use-immer';
import { Button, Modal } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

import styles from './index.less';

type ServerEnv = 'ONLINE' | 'LOCAL';
type Props = {
  changeDataModeCallback?: (env: ServerEnv) => void;
}
const DataModeCard: React.FC<Props> = ({
  changeDataModeCallback,
}) => {
  // 默认本地
  const defaultValue: ServerEnv = localStorage.getItem('GI_SERVER_ENV') === 'ONLINE' ? 'ONLINE' : 'LOCAL';
  const [state, updateState] = useImmer<{
    env: ServerEnv;
    visible: boolean;
  }>({
    env: defaultValue, // 该页面状态
    visible: !localStorage.getItem('GI_SERVER_ENV'), // 新用户第一次打开时没有该值，则打开弹窗
  })

  const modeList = [
    { img: '', value: 'LOCAL', label: '本地' },
    { img: '', value: 'ONLINE', label: '在线' },
  ]
  return (
    <>
      <Button type="text" onClick={() => {
        updateState(draft => { draft.visible = true })
      }}>{state.env === 'ONLINE' ? '在线' : '本地'}</Button>
      <Modal title="选择数据存储模式" okText="确定" cancelText="取消"
        visible={state.visible}
        width="50%"
        closable={false}
        onOk={() => {
          // 选择的状态与目前存储的状态相同时不改变
          if (state.env !== localStorage.getItem('GI_SERVER_ENV')) {
            localStorage.setItem('GI_SERVER_ENV', state.env);
            changeDataModeCallback?.(state.env);
          }
          updateState(draft => { draft.visible = false });
        }}
        onCancel={() => { updateState(draft => { draft.visible = false }) }}
      >
        {modeList.map(item => {
          return (
            <div className={styles.modalContent}
              onClick={() => {
                if (state.env === item.value) return;
                updateState(draft => { draft.env = item.value as ServerEnv });
              }}
            >
              <img src={item.img} style={{ opacity: state.env === item.value ? 0.5 : 1 }} />
              <span style={{ opacity: state.env === item.value ? 0.5 : 1 }}>{item.label}</span>
              {state.env === item.value && <CheckOutlined />}
            </div>
          )
        })}
      </Modal>
    </>
  )
}
export default DataModeCard;