const walkProperties = data => {
  const result = [];
  const walk = obj => {
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const isObject = Object.prototype.toString.call(value) === '[object Object]';
      if (isObject) {
        walk(value);
      } else {
        //@ts-ignore
        result.push(key);
      }
    });
  };
  walk(data);
  return [...new Set(result)];
};
export const getKeysByData = (data, category) => {
  try {
    if (category === 'node') {
      const node = data.nodes[0] || {};
      const result = walkProperties(node);

      return result;
    }
    if (category === 'edge') {
      const edge = data.edges[0] || {};
      const result = walkProperties(edge);

      return result;
    }
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
        //@ts-ignore
        fns.push(value);
        return placeholder;
      }
      return value;
    },
    2,
  );
  //@ts-ignore
  json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function (_) {
    return fns.shift();
  });

  return 'export default ' + json + '';
};
