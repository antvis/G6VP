import { useContext, utils } from "@alipay/graphinsight";
import { message } from "antd";
import * as React from "react";

export interface MyCounterProps {
  serviceId: string;
}
const LAYOUTS = ["graphin-force", "circle", "dagre", "concentric", "radial"];
let layoutIndex = 0;

const MyCounter: React.FunctionComponent<MyCounterProps> = (props) => {
  const context = useContext();

  const { data, services, updateContext, transform } = context;
  const service = utils.getService(services, props.serviceId);

  const { nodes = [], edges = [] } = data;
  const nodeCount = nodes.length;
  const edgeCount = edges.length;
  const handleClick = async () => {
    if (!service) {
      message.info("请先添加数据服务");
      return;
    }
    const res = await service();
    if (res) {
      const newData = utils.handleExpand(data, res);
      updateContext((draft) => {
        draft.data = transform(newData);
      });
    }
  };
  const onChangeLayout = () => {
    updateContext((draft) => {
      layoutIndex = layoutIndex + 1 === 5 ? 0 : layoutIndex + 1;
      draft.layout.type = LAYOUTS[layoutIndex];
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        background: "lightgreen",
        width: "300px",
      }}
    >
      <button onClick={handleClick}>查询新节点</button>
      My Countor nodes:{nodeCount} edges:{edgeCount}
      <button onClick={onChangeLayout}>改变布局</button>
      当前布局:{LAYOUTS[layoutIndex]}
    </div>
  );
};

export default MyCounter;
