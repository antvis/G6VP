export type CodeBlock = {
  language: string;
  code: string;
};

/**
 * 提取 Markdown 中的代码块
 * @param content
 */
export function extractCodeBlocks(markdown: string) {
  const codeBlockRegex = /```([a-zA-Z]+)?(?:\n)([\s\S]*?)```/g;
  const codeBlocks: CodeBlock[] = [];

  let match;
  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    const language = match[1] ? match[1] : 'unknown';
    const code = match[2].replace(/\n/g, ' ').trim();
    codeBlocks.push({ language, code });
  }

  return codeBlocks;
}
