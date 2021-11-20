
const BG_COLOR = '#1A1A1A';
// import {ITreeData} from "@/page/EnhancAnalysis/component/ReasonTree/interface";

// 得到key shape
export default function drawKeyShape(group: any) {
  // keyshape
  const keyshape = group?.addShape('circle', {
    attrs: {
      x: 0,
      y: 0,
      r: 54,
      opacity: 0,
      strokeOpacity: 0,
      fillOpacity: 0,
    },
  });
  // 底盘
  group?.addShape('circle', {
    attrs: {
      x: 0,
      y: 0,
      r: 54,
      fill: BG_COLOR,
      stroke: BG_COLOR,
    },
    name: 'keyShape',
  });
  return keyshape;
}
