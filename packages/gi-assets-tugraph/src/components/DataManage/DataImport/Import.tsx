import { DisconnectOutlined, LinkOutlined } from "@ant-design/icons";
import { Button, Drawer, message } from "antd";
import * as React from "react";
import TuGraphDataLoadPanel from "../../../services/ServerComponent";

interface DataImportProps {}

const DataImport: React.FunctionComponent<DataImportProps> = (props) => {
  const useToken = localStorage.getItem("TUGRAPH_USER_TOKEN");

  const [state, stateState] = React.useState({
    visible: true,
    connectStatus: useToken,
  });
  const { visible } = state;
  const handleImport = () => {
    stateState((preState) => {
      return {
        ...preState,
        visible: true,
      };
    });
  };
  const handleClose = () => {
    stateState((preState) => {
      return {
        ...preState,
        visible: false,
      };
    });
  };

  const closeConnect = () => {
    localStorage.removeItem("TUGRAPH_USER_TOKEN");
    localStorage.removeItem("CURRENT_TUGRAPH_SUBGRAPH");
    message.success("已断开与 TuGraph 的连接");

    stateState((preState) => {
      return {
        ...preState,
        connectStatus: null,
      };
    });
  };

  React.useEffect(() => {
    stateState((preState) => {
      return {
        ...preState,
        connectStatus: localStorage.getItem("TUGRAPH_USER_TOKEN"),
      };
    });
  }, [localStorage.getItem("TUGRAPH_USER_TOKEN")]);
  return (
    <div>
      {state.connectStatus ? (
        <Button
          danger
          onClick={closeConnect}
          size="small"
          style={{ marginRight: 8 }}
          icon={<DisconnectOutlined />}
        >
          断开连接
        </Button>
      ) : (
        <Button onClick={handleImport} size="small" icon={<LinkOutlined />}>
          连接
        </Button>
      )}
      <Drawer
        title="连接图数据库"
        visible={visible}
        onClose={handleClose}
        width="1000"
        contentWrapperStyle={{
          transform: "none",
        }}
      >
        <TuGraphDataLoadPanel onClose={handleClose} />
      </Drawer>
    </div>
  );
};

export default DataImport;
