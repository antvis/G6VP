import { PALETTES } from '../constants';

export const mapNodeToColorIndex = (id: string) => {
  const index = id.charCodeAt(0);
  return index;
};

export function getColor(index?: number, palette: string = 'normal') {
  const colors = PALETTES[palette];
  return colors[
    (index ?? Math.floor(Math.random() * colors.length)) % colors.length
  ];
}
