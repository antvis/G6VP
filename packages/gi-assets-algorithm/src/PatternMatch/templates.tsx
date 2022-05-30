
const twoNodePath = {
  nodes: [{
    id: 'node-1',
  }, {
    id: 'node-2',
  }],
  edges: [{
    source: 'node-1',
    target: 'node-2',
  }]
}
const threeNodePath = {
  nodes: [{
    id: 'node-1',
  }, {
    id: 'node-2',
  }, {
    id: 'node-3',
  }],
  edges: [{
    source: 'node-1',
    target: 'node-2',
  }, {
    source: 'node-2',
    target: 'node-3',
  }]
}
const fourNodeCycleData = {
  nodes: [{
    id: 'node-1',
  }, {
    id: 'node-2',
  },{ 
    id: 'node-3',
  }, {
    id: 'node-4',
  }],
  edges: [{
    source: 'node-1',
    target: 'node-2',
  }, {
    source: 'node-2',
    target: 'node-3',
  }, {
    source: 'node-3',
    target: 'node-4',
  }, {
    source: 'node-4',
    target: 'node-1',
  }]
}
const threeNodeCycleData = {
  nodes: [{
    id: 'node-1',
  }, {
    id: 'node-2',
  },{ 
    id: 'node-3',
  }],
  edges: [{
    source: 'node-1',
    target: 'node-2',
  }, {
    source: 'node-2',
    target: 'node-3',
  }, {
    source: 'node-3',
    target: 'node-1',
  }]
}

const fourNodePathData = {
  nodes: [{
    id: 'node-1',
  }, {
    id: 'node-2',
  }, { 
    id: 'node-3',
  }, { 
    id: 'node-4',
  }],
  edges: [{
    source: 'node-1',
    target: 'node-2',
  }, {
    source: 'node-2',
    target: 'node-3',
  }, {
    source: 'node-3',
    target: 'node-4',
  }]
}

const templates = [{
  id: 'template-0',
  name: '2-node-path',
  data: twoNodePath,
  screenshot: 'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*Lxr3SqrbBoYAAAAAAAAAAAAAARQnAQ'
}, {
  id: 'template-1',
  name: '3-node-path',
  data: threeNodePath,
  screenshot: 'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*hg-JR5jqtv8AAAAAAAAAAAAAARQnAQ'
}, {
  id: 'template-2',
  name: '4-node-path',
  data: fourNodePathData,
  screenshot: 'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*MtiXQ7NXhGEAAAAAAAAAAAAAARQnAQ'
}, {
  id: 'template-3',
  name: '3-node-cycle',
  data: threeNodeCycleData,
  screenshot: 'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*HnRpTYgqPpcAAAAAAAAAAAAAARQnAQ'
}, {
  id: 'template-4',
  name: '4-node-cycle',
  data: fourNodeCycleData,
  screenshot: 'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*Vri_TbluXgEAAAAAAAAAAAAAARQnAQ'
}]

export default templates;