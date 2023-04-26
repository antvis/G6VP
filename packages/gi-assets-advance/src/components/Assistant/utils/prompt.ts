import type { GraphSchemaData } from '@antv/gi-sdk';
import { Message } from './message';

/**
 * 转换图的数据信息为自然语言
 */
export function schemaToNL(schema: GraphSchemaData) {
  const { nodes, edges } = schema;

  const nodesDescription = `图中有 ${nodes.length} 种节点，分别是：${nodes
    .map((node) => `"${node.nodeType}"`)
    .join('，')}。`;
  const edgesDescription = `图中有 ${edges.length} 中边，分别是 ${edges
    .map((edge) => `"${edge.edgeType}"`)
    .join('，')}。`;

  return `${nodesDescription} ${edgesDescription}`;
}

export function getPrompt(prompt: string, schema: GraphSchemaData) {
  const graphSchema = schemaToNL(schema);

  return prompt.replace(/\$\{graphSchema\}/g, graphSchema);
}

export function getWelcomeMessage(
  welcome: string,
  prompt: string,
  schema: GraphSchemaData
) {
  return [
    prompt &&
      new Message({
        status: 'success',
        role: 'system',
        content: getPrompt(prompt, schema),
        timestamp: Date.now(),
        reserved: true,
      }),
    welcome &&
      new Message({
        status: 'success',
        role: 'assistant',
        content: welcome,
        timestamp: Date.now(),
        reserved: true,
      }),
  ].filter(Boolean) as Message[];
}
