import * as React from 'react';
interface ApplactionProps {}
//@ts-ignore
const { default: GI_SDK_APP } = window.GI_SDK_APP;

const Applaction: React.FunctionComponent<ApplactionProps> = props => {
  //@ts-ignore
  const { id } = props.match.params;
  const service = async () => {
    //@ts-ignore
    // const url = window.GI_USER_INFO
    //   ? 'https://unpkg.alipay.com/@alipay/gi-assets-vip@1.7.0/app/aml.json'
    //   : 'https://unpkg.com/@antv/gi-public-data/app/social.json';

    const url = `https://unpkg.alipay.com/@alipay/gi-assets-vip@latest/app/${id}`; // 内网 VIP 方案

    const config = await fetch(url).then(res => res.json());

    return {
      data: config,
      success: true,
    };
  };
  return (
    <div
      style={{
        height: '100vh',
        backgroundImage:
          'var(--layout-background,radial-gradient(at 13% 5%, hsla(214, 100%, 37%, 0.29) 0px, transparent 50%), radial-gradient(at 100% 100%, hsla(254, 66%, 56%, 0.11) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(355, 100%, 93%, 0) 0px, transparent 50%), radial-gradient(at 61% 52%, hsla(227, 64%, 46%, 0.05) 0px, transparent 50%), radial-gradient(at 88% 12%, hsla(227, 70%, 49%, 0.1) 0px, transparent 50%), radial-gradient(at 100% 37%, hsla(254, 68%, 56%, 0) 0px, transparent 50%))',
      }}
    >
      <GI_SDK_APP id={id} service={service} />
    </div>
  );
};

export default Applaction;
