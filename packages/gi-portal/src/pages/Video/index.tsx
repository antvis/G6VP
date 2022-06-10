import * as React from 'react';

interface VideoShowProps {}

const Card = ({ children }) => {
  return <div style={{ height: '360px', width: '500px', padding: '12px' }}>{children}</div>;
};

const VideoShow: React.FunctionComponent<VideoShowProps> = props => {
  return (
    <div
      // className="container"
      style={{
        minHeight: 'calc(100vh - 160px)',
      }}
    >
      <h2 style={{ textAlign: 'center' }}>「芒种日，图新物」发布会视频</h2>
      <div style={{ display: 'flex', flex: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Card>
          <iframe
            src="//player.bilibili.com/player.html?aid=512291880&bvid=BV1cg41197FL&cid=739947945&page=1"
            scrolling="no"
            //@ts-ignore
            border="0"
            width={'100%'}
            height={'100%'}
            frameborder="no"
            framespacing="0"
            allowfullscreen="true"
          ></iframe>
        </Card>
        <Card>
          <iframe
            src="//player.bilibili.com/player.html?aid=512252491&bvid=BV1mg411X7Bh&cid=739955308&page=1"
            scrolling="no"
            //@ts-ignore
            border="0"
            frameborder="no"
            framespacing="0"
            allowfullscreen="true"
            width={'100%'}
            height={'100%'}
          ></iframe>
        </Card>

        <Card>
          <iframe
            src="//player.bilibili.com/player.html?aid=299787611&bvid=BV1TF411V7wM&cid=739609364&page=1"
            scrolling="no"
            //@ts-ignore
            border="0"
            frameborder="no"
            framespacing="0"
            allowfullscreen="true"
            width={'100%'}
            height={'100%'}
          ></iframe>
        </Card>
        <Card>
          <iframe
            src="//player.bilibili.com/player.html?aid=342329992&bvid=BV1L94y1U7rU&cid=739997979&page=1"
            scrolling="no"
            //@ts-ignore
            border="0"
            frameborder="no"
            framespacing="0"
            allowfullscreen="true"
            width={'100%'}
            height={'100%'}
          ></iframe>
        </Card>
      </div>
    </div>
  );
};

export default VideoShow;
