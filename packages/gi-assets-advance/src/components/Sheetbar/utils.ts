export const getStyles: any = (height: number, placement: 'top' | 'bottom'): { [key: string]: React.CSSProperties } => {
  if (placement === 'top') {
    return {
      container: {
        position: 'relative',
        top: `${height}px`,
        height: `calc( 100% - ${height}px )`,
      },
      sheetbar: {
        position: 'absolute',
        display: 'flex',
        top: '0px',
        left: '0px',
        right: '0px',
        height: `${height + 1}px`,
        lineHeight: `${height + 1}px`,
        background: `var(--background-color)`,
        zIndex: 300,
        borderBottom: `1px solid var(--border-color)`,
      },
    };
  }

  return {
    container: {
      position: 'relative',
      top: `unset`,
      height: `calc( 100% - ${height}px )`,
    },
    sheetbar: {
      display: 'flex',
      position: 'absolute',
      bottom: '0px',
      left: '0px',
      right: '0px',
      height: `${height + 1}px`,
      lineHeight: `${height + 1}px`,
      background: `var(--background-color)`,
      zIndex: 300,
      borderTop: `1px solid var(--border-color)`,
    },
  };
};
