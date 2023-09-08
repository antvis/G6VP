import type { IGIAC } from '@antv/gi-sdk';
import { extra, useContext } from '@antv/gi-sdk';
import React, { memo } from 'react';
import { dataURLToImage } from '../utils/graph';
const { GIAComponent } = extra;
export interface DownLoad {
  GIAC: IGIAC;
  mode?: 'full' | 'viewport';
  copyright?: string;
}

const DownLoad: React.FunctionComponent<DownLoad> = props => {
  const { GIAC, mode, copyright } = props;
  const { graph } = useContext();
  const handleDownload = () => {
    if (!copyright) {
      if (mode === 'full') {
        graph.downloadFullImage();
      } else {
        graph.downloadImage();
      }
    } else {
      const callback = dataUrl => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const copyrightImg = new Image();
        const graphImg = new Image();
        const output = () => {
          canvas.width = graphImg.width;
          canvas.height = graphImg.height;
          ctx.drawImage(graphImg, 0, 0, graphImg.width, graphImg.height);
          const copyrightImageSize = [
            graphImg.width / 2,
            (graphImg.width / 2) * (copyrightImg.height / copyrightImg.width),
          ];
          ctx.drawImage(
            copyrightImg,
            graphImg.width - copyrightImageSize[0] - 8,
            graphImg.height - copyrightImageSize[1] - 8,
            copyrightImageSize[0],
            copyrightImageSize[1],
          );
          const fullUrl = canvas.toDataURL('image/png');
          const link: HTMLAnchorElement = document.createElement('a');
          dataURLToImage(fullUrl, 'canvas', link, 'graph.png');
        };
        let graphImgReady = false;
        let copyrightImgReady = false;
        graphImg.onload = () => {
          graphImgReady = true;
          if (graphImgReady && copyrightImgReady) output();
        };
        copyrightImg.onload = () => {
          copyrightImgReady = true;
          if (graphImgReady && copyrightImgReady) output();
        };
        copyrightImg.crossOrigin = 'anonymous';
        copyrightImg.referrerPolicy = 'no-referrer';
        graphImg.src = dataUrl;
        copyrightImg.src = copyright;
      };
      if (mode === 'full') {
        graph.toFullDataURL(callback);
      } else {
        const dataUrl = graph.toDataURL();
        callback(dataUrl);
      }
    }
  };
  return <GIAComponent GIAC={GIAC} onClick={handleDownload} />;
};

export default memo(DownLoad);
