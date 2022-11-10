import * as React from 'react';

const defaultOptions = {
  rotate: 30,
  color: 'rgba(0, 0, 0, 0.1)',
  width: 200,
  height: 120,
  fontSize: 12,
  fontAjust: 1.2,
  offsetX: 0,
  offsetY: 0,
};

const drawWaterMark = props => {
  const canvas = document.createElement('canvas');
  const { text, options = defaultOptions } = props;
  const {
    rotate = defaultOptions.rotate,
    color = defaultOptions.color,
    width = defaultOptions.width,
    height = defaultOptions.height,
    fontSize = defaultOptions.fontSize,
    fontAjust = defaultOptions.fontAjust,
    offsetX = defaultOptions.offsetX,
    offsetY = defaultOptions.offsetY,
  } = options;
  const ctx = canvas.getContext('2d');
  const textLength = text.length * fontSize * fontAjust;
  const rotatePI = (Number(rotate) / 180) * Math.PI;
  const calcWidth = Math.round(textLength * Math.cos(rotatePI)) + offsetX;
  const calcHeight = Math.round(textLength * Math.sin(rotatePI)) + offsetY;

  const textAlign = {
    x: 0,
    y: calcHeight,
  };
  canvas.width = calcWidth;
  canvas.height = calcHeight;
  if (!canvas.getContext) {
    //你的浏览器不支持canvas!
    return;
  }
  if (ctx) {
    ctx.font = `${fontSize}px serif`;
    ctx.rotate((-`${rotate}` * Math.PI) / 180); // 逆时针方向
    ctx.fillStyle = color;
    ctx.fillText(`${text}`, textAlign.x, textAlign.y);
    const url = ctx.canvas.toDataURL();
    return url;
  }
};

const WaterMark: React.FunctionComponent<any> = props => {
  return null;
};

export default WaterMark;
