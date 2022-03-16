import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

import styles from './index.less';

type Props = {
  changeDataModeCallback?: (online: boolean) => void;
}
const DataModeCard: React.FC<Props> = ({
  changeDataModeCallback,
}) => {
  // 默认本地
  const defaultValue = !!localStorage.getItem('dataInOnline') || localStorage.getItem('dataInOnline') === 'true';
  const [localOnline, setLocalOnline] = useState<boolean>(defaultValue); // 本地状态
  const [online, setOnline] = useState<boolean>(localOnline); // 该页面状态
  const [visible, setVisible] = useState(!localStorage.getItem('dataInOnline')); // 新用户第一次打开时没有该值，则打开弹窗

  const modeList = [
    { img: '', value: false, label: '本地' },
    { img: '', value: true, label: '在线' },
  ]
  return (
    <>
      <Button type="text" onClick={() => setVisible(true)}>{online ? '在线' : '本地'}</Button>
      <Modal title="选择数据存储模式" okText="确定" cancelText="取消"
        visible={visible}
        width="50%"
        closable={false}
        onOk={() => {
          setVisible(false);
          if (online === localOnline) return; // 选择的状态与目前存储的状态相同时不改变
          localStorage.setItem('dataInOnline', online.toString());
          changeDataModeCallback?.(online);
          setLocalOnline(online);

        }}
        onCancel={() => { setVisible(false) }}
      >
        {modeList.map(item => {
          return (
            <div className={styles.modalContent}
              onClick={() => {
                if (online === item.value) return;
                setOnline(item.value)
              }}
            >
              <img src={item.img} style={{ opacity: online === item.value ? 0.5 : 1 }} />
              <span style={{ opacity: online === item.value ? 0.5 : 1 }}>{item.label}</span>
              {online === item.value && <CheckOutlined />}
            </div>
          )
        })}
      </Modal>
    </>
  )
}
export default DataModeCard;