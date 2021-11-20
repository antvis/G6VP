export const serviceLists = [
  {
    id: 'GI_SERVICE_INTIAL_GRAPH',
    content: `(data)=>{ return data }`,
    mode: 'MOCK',
    name: '初始化请求数据接口',
  },

  {
    id: 'GI_SERVICE_Mock_Expand',
    mode: 'MOCK',
    name: 'GI官方提供的Mock体验接口',
    content: `
    (data, params) => {
      const { id = Math.random() } =params;
      const MockEdges = [];
      const MockNodes = [];
       Array.from({length:5}).forEach((c,index)=>{
         MockNodes.push({
           id:id+"_"+index,
           data:{
            id:id+"_"+index,
           }
         })
          MockEdges.push({
           source:id,
           target:id+"_"+index,
           data:{
             source:id,
             target:id+"_"+index,
           }
         })
      })
      /** End：组件市场里定义的逻辑;*/
    
      return {
        nodes:MockNodes,
        edges:MockEdges
      };
    }
    
    `,
  },
];
