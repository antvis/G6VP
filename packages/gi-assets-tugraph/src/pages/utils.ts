/**
 *
 * @param source 原数据 格式 { type:"object",properties:{}}
 * @returns
 */
export const getDefaultValues = (s) => {
  const ROOT = "props";
  const result = {};
  const walk = (schema, obj, k) => {
    const { type, properties } = schema;
    if (type === "void") {
      Object.keys(properties).forEach((key) => {
        walk(properties[key], obj, key);
      });
      return;
    }
    if (type === "object") {
      obj[k] = {};
      const val = obj[k];
      Object.keys(properties).forEach((key) => {
        walk(properties[key], val, key);
      });
      return;
    }
    obj[k] = schema.default;
  };
  walk(s, result, ROOT);
  return result[ROOT];
};
