export const getKeysByData = (data, category) => {
  try {
    return category === 'node' ? Object.keys(data.nodes[0].data) : Object.keys(data.edges[0].data);
  } catch (error) {
    return ['id'];
  }
};
