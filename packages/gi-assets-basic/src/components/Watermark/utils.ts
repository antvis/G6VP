import { kebabCase } from 'lodash';

/** 将对象 key 从驼峰式转换为 kebab 式 */
export function getStyleStr(style: React.CSSProperties): string {
  return Object.keys(style)
    .map(key => `${kebabCase(key)}: ${style[key]};`)
    .join(' ');
}

/** 获取设备的物理像素分辨率与 css 像素分辨率的比值 */
export function getPixelRatio() {
  return window.devicePixelRatio || 1;
}

/** 以水印为中心旋转 */
export function rotateWatermark(ctx: CanvasRenderingContext2D, rotateX: number, rotateY: number, rotate?: number) {
  ctx.translate(rotateX, rotateY);
  ctx.rotate((Math.PI / 180) * Number(rotate));
  ctx.translate(-rotateX, -rotateY);
}
