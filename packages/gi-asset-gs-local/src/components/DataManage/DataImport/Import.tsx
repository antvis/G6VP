import { UploadOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import GsNotebook from "gs-notebook";
import * as React from "react";

interface DataImportProps {}

const DataImport: React.FunctionComponent<DataImportProps> = (props) => {
  const [state, stateState] = React.useState({
    visible: false,
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
  const onCreateGraph = (params) => {
    console.log("graph params", params);
  };
  const onCreateVertex = (params) => {
    console.log("vertex obj", params);
    return true;
  };
  const onEditVertex = (params) => {
    console.log("vertex obj", params);
    return false;
  };
  const onCreateEdge = (params) => {
    console.log("edge obj", params);
    return true;
  };
  const onEditEdge = (params) => {
    console.log("edge obj", params);
    return true;
  };
  const onDeleteVertex = (parmas) => {
    console.log("vertex obj", parmas);
    return false;
  };
  const onDeleteEdge = (params) => {
    console.log("edge obj", params);
    return true;
  };
  return (
    <div>
      <Button onClick={handleImport} size="small" icon={<UploadOutlined />}>
        导入
      </Button>
      <Drawer
        title="导入数据"
        visible={visible}
        onClose={handleClose}
        width="calc(100vw - 450px)"
      >
        <GsNotebook
          onCreateGraph={onCreateGraph}
          onCreateVertex={onCreateVertex}
          onCreateEdge={onCreateEdge}
          onEditVertex={onEditVertex}
          onEditEdge={onEditEdge}
        />
      </Drawer>
    </div>
  );
};

export default DataImport;
