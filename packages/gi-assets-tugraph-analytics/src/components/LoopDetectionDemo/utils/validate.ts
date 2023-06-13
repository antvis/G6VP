export function validateWebSocketURL(url: string): boolean {
  // 检查URL是否以ws://或wss://开头
  const regex = /^(ws|wss):\/\//;
  if (!regex.test(url)) {
    return false;
  }

  // 使用URL对象进行更详细的验证
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== 'ws:' && parsedUrl.protocol !== 'wss:') {
      return false;
    }
  } catch (error) {
    return false;
  }

  return true;
}

/**
 * 基于正则表达式验证文本是否满足图数据格式
 * . 1,jim
 * . 2,tom
 * - 1,2,0.2
 */
export function validateGraphData(data: string): boolean {
  const regexNode = /^\.\s\d{1,2},[a-zA-Z]+$/;
  const regexEdge = /^- \d+,\d+,\d+(\.\d+)?$/;

  const lines = data.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!regexNode.test(line) && !regexEdge.test(line)) {
      return false;
    }
  }
  return true;
}
