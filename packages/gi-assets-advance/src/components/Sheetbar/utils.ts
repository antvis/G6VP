export const getStyles = (height: number, placement: 'top' | 'bottom'): { [key: string]: React.CSSProperties } => {
  if (placement === 'top') {
    return {
      container: {
        position: 'absolute',
        top: `${height}px`,
        height: `calc( 100% - ${height}px )`,
      },
      sheetbar: {
        position: 'absolute',
        display: 'flex',
        top: '0px',
        left: '0px',
        right: '0px',
        height: `${height}px`,
        lineHeight: `${height}px`,
        background: '#fff',
        border: '1px solid rgb(250, 250, 250)',
        zIndex: 99,
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
      height: `${height}px`,
      lineHeight: `${height}px`,
      background: '#fff',
      border: '1px solid rgb(250, 250, 250)',
      zIndex: 99,
    },
  };
};
