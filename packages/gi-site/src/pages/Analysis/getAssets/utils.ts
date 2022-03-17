export const getKeysByData = (data, category) => {
  try {
    return category === 'node' ? Object.keys(data.nodes[0].data) : Object.keys(data.edges[0].data);
  } catch (error) {
    return ['id'];
  }
};

export const stringify = function (obj) {
  const placeholder = '____PLACEHOLDER____';
  const fns = [];
  let json = JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === 'function') {
        fns.push(value);
        return placeholder;
      }
      return value;
    },
    2,
  );

  json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function (_) {
    return fns.shift();
  });

  return 'export default ' + json + '';
};
