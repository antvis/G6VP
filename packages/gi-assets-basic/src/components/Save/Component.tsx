import { useContext, utils } from '@alipay/graphinsight';
import { Button, notification } from 'antd';
import React from 'react';

export interface Props {
  serviceId: string;
}

const Save: React.FunctionComponent<Props> = props => {
  const { serviceId } = props;
  const { graph, GISDK_ID, config, services } = useContext();
  const service = utils.getService(services, serviceId);
  const handleSave = () => {
    const data = graph.save();
    service({
      data, //数据，带布局信息
      config, //配置，可以还原画布状态
      services, //服务
    }).then(res => {
      if (res.success) {
        notification.success({
          message: '保存成功',
          description: '3秒后将自动跳转到分享的画布页',
          duration: 3,
        });
        setTimeout(() => {
          window.open(res.data);
        }, 3000);
      }
    });
  };

  return (
    <div>
      <Button onClick={handleSave}> Save </Button>
    </div>
  );
};

export default Save;
