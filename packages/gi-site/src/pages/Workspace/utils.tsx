/**
 *
 * @param
 * @returns ( ) => uuid: string
 */
export const getUid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const getMockData = () => {
  // const id = 'explame';
  // const MockEdges = [];
  // const MockNodes = [];
  // MockNodes.push({
  //   id,
  //   data: {
  //     id,
  //   },
  // });
  // Array.from({ length: 5 }).forEach((c, index) => {
  //   MockNodes.push({
  //     id: id + '_' + index,
  //     data: {
  //       id: id + '_' + index,
  //     },
  //   });
  //   MockEdges.push({
  //     source: id,
  //     target: id + '_' + index,
  //     data: {
  //       source: id,
  //       target: id + '_' + index,
  //     },
  //   });
  // });
  return {
    nodes: [],
    edges: [],
  };
};
