import { useContext, utils } from '@antv/gi-sdk';
import React, { useEffect, useRef, useState } from 'react';
import { getPixelRatio, getStyleStr, rotateWatermark } from './utils';
import ReactDOM from 'react-dom';

const BaseSize = 2;
const FontGap = 3;

/** 渲染模式，控制组件在整个页面还是仅在画布上渲染 */
enum RenderMode {
  Canvas = 'canvas',
  Page = 'page',
}

export interface WatermarkProps {
  watermarkServiceId: string;
  renderMode: RenderMode;
  zIndex?: number;
  rotate?: number;
  width?: number;
  height?: number;
  fontColor: string;
  fontSize?: number;
  gap?: [number, number];
  offset?: [number, number];
}

const Watermark: React.FunctionComponent<WatermarkProps> = props => {
  const {
    watermarkServiceId,
    renderMode,
    zIndex,
    rotate,
    width,
    height,
    fontColor,
    fontSize,
    gap,
    offset,
  } = props;
  const { GISDK_ID, services } = useContext();

  /** 水印文字内容 */
  const [content, setContent] = useState('');
  /** 水印图片源 */
  const [image, setImage] = useState('');

  const watermarkService = utils.getService(services, watermarkServiceId);

  /** 获取渲染区域 */
  const GISDK_DOM = document.getElementById(`${GISDK_ID}-container`) as HTMLDivElement;
  const PAGE_DOM = document.getElementsByClassName('gi-analysis-canvas')[0] as HTMLDivElement;
  const RenderDomMap: Record<RenderMode, HTMLDivElement> = {
    [RenderMode.Canvas]: GISDK_DOM,
    [RenderMode.Page]: PAGE_DOM,
  };

  const [gapX, gapY] = gap!;
  const gapXCenter = gapX / 2;
  const gapYCenter = gapY / 2;
  const offsetLeft = offset?.[0] ?? gapXCenter;
  const offsetTop = offset?.[1] ?? gapYCenter;

  const getMarkStyle = () => {
    const markStyle: React.CSSProperties = {
      zIndex,
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      backgroundRepeat: 'repeat',
    };

    /** 计算偏移量的样式 */
    let positionLeft = offsetLeft - gapXCenter;
    let positionTop = offsetTop - gapYCenter;
    if (positionLeft > 0) {
      markStyle.left = `${positionLeft}px`;
      markStyle.width = `calc(100% - ${positionLeft}px)`;
      positionLeft = 0;
    }
    if (positionTop > 0) {
      markStyle.top = `${positionTop}px`;
      markStyle.height = `calc(100% - ${positionTop}px)`;
      positionTop = 0;
    }
    markStyle.backgroundPosition = `${positionLeft}px ${positionTop}px`;

    return markStyle;
  };

  const watermarkRef = useRef<HTMLDivElement | null>(null);

  const destroyWatermark = () => {
    if (watermarkRef.current) {
      watermarkRef.current = null;
    }
  };

  const appendWatermark = (base64Url: string, markWidth: number) => {
    if (watermarkRef.current) {
      watermarkRef.current.setAttribute(
        'style',
        getStyleStr({
          ...getMarkStyle(),
          backgroundImage: `url('${base64Url}')`,
          backgroundSize: `${(gapX + markWidth) * BaseSize}px`,
        }),
      );
    }
  };

  const getMarkSize = (ctx: CanvasRenderingContext2D) => {
    let defaultWidth = 120;
    let defaultHeight = 64;
    if (!image && ctx.measureText) {
      ctx.font = `${Number(fontSize)}px`;
      const contents = Array.isArray(content) ? content : [content];
      const widths = contents.map(item => ctx.measureText(item!).width);
      defaultWidth = Math.ceil(Math.max(...widths));
      defaultHeight = 16 * contents.length + (contents.length - 1) * FontGap;
    }
    return [width ?? defaultWidth, height ?? defaultHeight] as const;
  };

  const fillTexts = (
    ctx: CanvasRenderingContext2D,
    drawX: number,
    drawY: number,
    drawWidth: number,
    drawHeight: number,
  ) => {
    const ratio = getPixelRatio();
    const mergedFontSize = Number(fontSize) * ratio;
    ctx.font = `normal normal normal ${mergedFontSize}px/${drawHeight}px sans-serif`;
    ctx.fillStyle = fontColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.translate(drawWidth / 2, 0);
    const contents = Array.isArray(content) ? content : [content];
    contents?.forEach((item, index) => {
      ctx.fillText(item ?? '', drawX, drawY + index * (mergedFontSize + FontGap * ratio));
    });
  };

  const drawText = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    drawX: number,
    drawY: number,
    drawWidth: number,
    drawHeight: number,
    alternateRotateX: number,
    alternateRotateY: number,
    alternateDrawX: number,
    alternateDrawY: number,
    markWidth: number,
  ) => {
    fillTexts(ctx, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();
    rotateWatermark(ctx, alternateRotateX, alternateRotateY, rotate);
    fillTexts(ctx, alternateDrawX, alternateDrawY, drawWidth, drawHeight);
    appendWatermark(canvas.toDataURL(), markWidth);
  };

  const renderWatermark = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!watermarkRef.current) {
      watermarkRef.current = document.getElementById('gi-watermark') as HTMLDivElement;
    }

    if (ctx) {
      const ratio = getPixelRatio();
      const [markWidth, markHeight] = getMarkSize(ctx);
      const canvasWidth = (gapX + markWidth) * ratio;
      const canvasHeight = (gapY + markHeight) * ratio;
      canvas.setAttribute('width', `${canvasWidth * BaseSize}px`);
      canvas.setAttribute('height', `${canvasHeight * BaseSize}px`);

      const drawX = (gapX * ratio) / 2;
      const drawY = (gapY * ratio) / 2;
      const drawWidth = markWidth * ratio;
      const drawHeight = markHeight * ratio;
      const rotateX = (drawWidth + gapX * ratio) / 2;
      const rotateY = (drawHeight + gapY * ratio) / 2;
      /** Alternate drawing parameters */
      const alternateDrawX = drawX + canvasWidth;
      const alternateDrawY = drawY + canvasHeight;
      const alternateRotateX = rotateX + canvasWidth;
      const alternateRotateY = rotateY + canvasHeight;

      ctx.save();
      rotateWatermark(ctx, rotateX, rotateY, rotate);

      if (image) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          /** Draw interleaved pictures after rotation */
          ctx.restore();
          rotateWatermark(ctx, alternateRotateX, alternateRotateY, rotate);
          ctx.drawImage(img, alternateDrawX, alternateDrawY, drawWidth, drawHeight);
          appendWatermark(canvas.toDataURL(), markWidth);
        };
        img.onerror = () =>
          drawText(
            canvas,
            ctx,
            drawX,
            drawY,
            drawWidth,
            drawHeight,
            alternateRotateX,
            alternateRotateY,
            alternateDrawX,
            alternateDrawY,
            markWidth,
          );
        img.crossOrigin = 'anonymous';
        img.referrerPolicy = 'no-referrer';
        img.src = image;
      } else {
        drawText(
          canvas,
          ctx,
          drawX,
          drawY,
          drawWidth,
          drawHeight,
          alternateRotateX,
          alternateRotateY,
          alternateDrawX,
          alternateDrawY,
          markWidth,
        );
      }
    }
  };

  useEffect(() => {
    renderWatermark();
    return () => {
      destroyWatermark();
    };
  }, [
    watermarkServiceId,
    renderMode,
    rotate,
    zIndex,
    width,
    height,
    image,
    content,
    fontColor,
    fontSize,
    gapX,
    gapY,
    offsetLeft,
    offsetTop,
  ]);

  return ReactDOM.createPortal(<div id="gi-watermark" ref={watermarkRef}></div>, RenderDomMap[renderMode]);
};

export default Watermark;
