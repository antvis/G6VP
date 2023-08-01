import { GuiIcon, TableColCell } from '@antv/s2';
import { get } from '@antv/util';
import { getCurrentSortMethod, hasFilterParams } from './utils/filter';

const iconMap = {
  none: 'Filter',
  asc: 'SortUp',
  desc: 'SortDown',
};

export class CustomTableColCell extends TableColCell {
  onIconClick;

  constructor(meta, spreadsheet, headerConfig, callback) {
    super(meta, spreadsheet, headerConfig);
    this.onIconClick = callback;
  }

  drawTextShape() {
    super.drawTextShape();

    const { x, y, width: cellWidth, height: cellHeight } = this.meta;
    const style = this.getStyle();
    const iconSize = get(style, 'icon.size');
    const iconMargin = get(style, 'icon.margin');

    const iconX = x + cellWidth - iconSize - iconMargin?.right;
    const iconY = y + cellHeight / 2 - iconSize / 2;

    this.renderFilterIcon({
      x: iconX,
      y: iconY + 2,
      width: iconSize,
      height: iconSize,
    });
  }

  renderFilterIcon(position) {
    const sortMethod = getCurrentSortMethod(this.meta.value, this.spreadsheet.dataCfg.sortParams);
    /**
     * 有值说明有加filter
     */

    const isFiltered = hasFilterParams(this.meta.value, this.spreadsheet.dataCfg.filterParams);

    const { x, y, width, height } = position;
    const icon = new GuiIcon({
      name: iconMap[sortMethod.toLowerCase()],
      x,
      y,
      width,
      height,
      fill: isFiltered ? '#ffc069' : 'rgba(255, 255, 255, 0.3)',
      cursor: 'pointer',
    });
    this.add(icon);

    icon.on('click', () => {
      this.onIconClick?.({
        meta: this.meta,
      });
    });
  }
}
