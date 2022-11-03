import Graphin from '@antv/graphin';
let registeredShapes = '';
let registeredLayouts = '';

export const registerShapes = Elements => {
  if (Elements) {
    const nextShapes = Object.keys(Elements).join('-');
    const prevShapes = registeredShapes;
    if (nextShapes !== prevShapes) {
      Object.keys(Elements).forEach(type => {
        Elements[type].registerShape(Graphin);
      });
      registeredShapes = nextShapes;
    }
  }
};
export const registerLayouts = Layouts => {
  if (Layouts) {
    const nextLayout = Object.keys(Layouts).join('-');
    const prevLayout = registeredLayouts;
    if (nextLayout !== prevLayout) {
      Object.keys(Layouts).forEach(type => {
        Layouts[type].registerLayout(Graphin);
      });
      registeredLayouts = nextLayout;
    }
  }
};

// export const  registerIconFont =()=>{
//   return
//   const MyIcon = React.useMemo(() => {
//     return createFromIconfontCN({
//       scriptUrl: iconFontUrl, // 在 iconfont.cn 上生成
//     });
//   }, [iconFontUrl]);
// }
