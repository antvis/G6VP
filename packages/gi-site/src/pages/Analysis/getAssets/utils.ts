export const getKeysByData = data => {
  try {
    return Object.keys(data.nodes[0].data);
  } catch (error) {
    return ['id'];
  }
};
