import { GraphSchemaData } from '@antv/gi-sdk';

const getColumns = (schemaData: GraphSchemaData, type: 'nodes' | 'edges') => {
  const schema = schemaData[type];
  //@ts-ignore
  const properties = schema.reduce((acc, cur) => {
    return {
      ...acc,
      ...cur.properties,
    };
  }, {});

  let columns: string[] = [];
  for (let key in properties) {
    if (typeof properties[key] === 'number' || typeof properties[key] === 'string') {
      columns.push(key);
    }
  }
  return columns;
};
export default getColumns;
