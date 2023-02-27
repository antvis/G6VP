import * as React from 'react';
interface NotificationProps {
  items: { type: string; url: string; name: string }[];
}

const styles: Record<string, React.CSSProperties> = {
  ul: {
    // listStyle: 'none',
    margin: '0px',
    padding: '0px 0px 0px 8px',
  },
  li: {
    // listStyle: 'none',
  },
  a: {
    fontSize: '14px',
    // transform: 'scale(0.6)',
    color: 'var(--text-color)',
    lineHeight: 2,
  },
};

const Notification: React.FunctionComponent<NotificationProps> = props => {
  const { items } = props;
  return (
    <ul style={styles.ul}>
      {items.map(item => {
        const { type, url, name } = item;
        return (
          <li key={url} style={styles.li}>
            {/* <Tag style={{ fontSize: '10px' }}>{type} </Tag> */}
            <a href={url} target="_blank" style={styles.a}>
              {name}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default Notification;
