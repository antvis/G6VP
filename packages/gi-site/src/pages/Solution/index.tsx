import * as React from 'react';

interface SolutionProps {}

const Solution: React.FunctionComponent<SolutionProps> = props => {
  const [state, setState] = React.useState({
    lists: [],
    isLoading: true,
  });
  const { lists, isLoading } = state;
  React.useEffect(() => {
    //@ts-ignore
    const url = window.GI_USER_INFO
      ? 'https://unpkg.alipay.com/@alipay/gi-assets-vip@latest/solution/index.json'
      : 'https://unpkg.com/@antv/gi-public-data/app/social.json';

    fetch(url)
      .then(res => res.json())
      .then(res => {
        setState(preState => {
          return {
            ...preState,
            lists: res,
            isLoading: false,
          };
        });
      });
  }, []);

  if (isLoading) {
    return <div>loading...</div>;
  }
  return <div>solution</div>;
};

export default Solution;
