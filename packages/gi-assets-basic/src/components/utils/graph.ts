import type { GraphinData } from '@antv/graphin';

export const scaleNodes = (graphData: GraphinData, value: number = 600) => {
  const { nodes = [], edges = [] } = graphData;
  if (!nodes?.length) {
    return;
  }
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  nodes.forEach(node => {
    if (node.x === undefined || node.y === undefined) {
      return;
    }
    if (node.x < minX) {
      minX = node.x;
    }
    if (node.x > maxX) {
      maxX = node.x;
    }
    if (node.y < minY) {
      minY = node.y;
    }
    if (node.y > maxY) {
      maxY = node.y;
    }
  });
  const wRatio = (maxX - minX) / value;
  const hRatio = (maxY - minY) / value;
  const ratio = Math.max(wRatio, hRatio);
  if (ratio < 1) {
    return {
      nodes,
      edges,
    };
  }
  return {
    nodes: nodes.map(node => ({
      ...node,
      x: node.x ? node.x / ratio : undefined,
      y: node.y ? node.y / ratio : undefined,
    })),
    edges,
  };
};

export const dataURLToImage = (dataURL: string, renderer: string, link, fileName) => {
  if (!dataURL || dataURL === 'data:') {
    console.error('Download image failed. The graph is too large or there is invalid attribute values in graph items');
    return;
  }
  if (typeof window !== 'undefined') {
    if (window.Blob && window.URL && renderer !== 'svg') {
      const arr = dataURL.split(',');
      let mime = '';
      if (arr && arr.length > 0) {
        const match = arr[0].match(/:(.*?);/);
        // eslint-disable-next-line prefer-destructuring
        if (match && match.length >= 2) mime = match[1];
      }

      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      const blobObj = new Blob([u8arr], { type: mime });

      if ((window.navigator as any).msSaveBlob) {
        (window.navigator as any).msSaveBlob(blobObj, fileName);
      } else {
        link.addEventListener('click', () => {
          link.download = fileName;
          link.href = window.URL.createObjectURL(blobObj);
        });
      }
    } else {
      link.addEventListener('click', () => {
        link.download = fileName;
        link.href = dataURL;
      });
    }
  }
  const e = document.createEvent('MouseEvents');
  e.initEvent('click', false, false);
  link.dispatchEvent(e);
};

export default {
  scaleNodes,
  dataURLToImage,
};
