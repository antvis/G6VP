export function createDownload(content: string | Blob, filename: string = 'untitled.txt') {
  const eleLink = document.createElement('a');
  eleLink.download = filename;
  eleLink.style.display = 'none';
  const blob = typeof content === 'string' ? new Blob([content]) : content;
  eleLink.href = URL.createObjectURL(blob);
  document.body.appendChild(eleLink);
  eleLink.click();
  document.body.removeChild(eleLink);
  URL.revokeObjectURL(eleLink.href);
}
