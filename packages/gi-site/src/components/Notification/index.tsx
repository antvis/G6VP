import { BellOutlined } from '@ant-design/icons';
import { Button, Drawer, Popover } from 'antd';
import { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { IVersionObj } from './type';
import VersionList from './VersionList';

export interface IState {
  popoverVisible: boolean;
  drawerVisible: boolean;
  versionInfo: IVersionObj[];
}

const Notification = () => {
  const [state, updateState] = useImmer<IState>({
    popoverVisible: false,
    drawerVisible: false,
    versionInfo: [],
  });

  useEffect(() => {
    fetch('https://render.alipay.com/p/yuyan/notifcation_version2/zh_CN.json')
      .then(res => res.json())
      .then((versionInfo: IVersionObj[]) => {
        if (!versionInfo) return;
        versionInfo.reverse();
        const { version } = versionInfo[0] || {};

        updateState(draft => {
          draft.versionInfo = versionInfo;
          draft.popoverVisible = version === localStorage.getItem('GI-VERSION') ? false : true;
        });
        localStorage.setItem('GI-VERSION', version);
      });
  }, []);

  // useEffect(() => {
  //   // 一秒后关闭提示
  //   const timeId = setTimeout(() => {
  //     updateState(draft => {
  //       draft.popoverVisible = false;
  //     });
  //   }, 1000);
  //   return () => {
  //     clearTimeout(timeId);
  //   };
  // }, []);

  const content = (
    <div>
      <p>G6VP 新版本上线啦 🎉</p>
    </div>
  );

  const handleClick = () => {
    updateState(draft => {
      draft.drawerVisible = true;
      draft.popoverVisible = false;
    });
  };

  const onCloseDrawer = () => {
    updateState(draft => {
      draft.drawerVisible = false;
    });
  };

  return (
    <>
      <Popover visible={state.popoverVisible} title="版本通知" content={content} placement="bottom">
        <Button icon={<BellOutlined />} onClick={handleClick}>
          版本通知
        </Button>
      </Popover>
      <Drawer visible={state.drawerVisible} onClose={onCloseDrawer} closable closeIcon={false} width="600px">
        <VersionList versionInfo={state.versionInfo}></VersionList>
      </Drawer>
    </>
  );
};

export default Notification;
