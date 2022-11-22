import locale from '@aligov/global-locale';
import * as React from 'react';
import i18n from '../../i18n/index';
import './index.less';
const { change } = i18n;
interface LanguageSwitchProps {}

const LanguageSwitch: React.FunctionComponent<LanguageSwitchProps> = props => {
  const { lang = 'zh-CN' } = locale.getLocale();
  const [state, setState] = React.useState({
    language: lang,
  });

  const onChange = val => {
    const { language } = val;
    setState({ language });

    if (language !== state.language) {
      change(language);
      window.location.reload();
    }
  };
  const { language } = state;

  return (
    <div className="dropdown">
      <button className="dropbtn">
        <svg
          className="icon"
          viewBox="0 0 1088 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="6294"
          width="16"
          height="16"
        >
          <path
            d="M729.6 294.4c19.2 57.6 44.8 102.4 89.6 147.2 38.4-38.4 64-89.6 83.2-147.2H729.6z m-422.4 320h166.4l-83.2-224z"
            p-id="6295"
          ></path>
          <path
            d="M947.2 0h-768c-70.4 0-128 57.6-128 128v768c0 70.4 57.6 128 128 128h768c70.4 0 128-57.6 128-128V128c0-70.4-51.2-128-128-128zM633.6 825.6c-12.8 12.8-25.6 12.8-38.4 12.8-6.4 0-19.2 0-25.6-6.4s-12.8 0-12.8-6.4-6.4-12.8-12.8-25.6-6.4-19.2-12.8-32l-25.6-70.4h-224L256 768c-12.8 25.6-19.2 44.8-25.6 57.6-6.4 12.8-19.2 12.8-38.4 12.8-12.8 0-25.6-6.4-38.4-12.8-12.8-12.8-19.2-19.2-19.2-32 0-6.4 0-12.8 6.4-25.6s6.4-19.2 12.8-32l140.8-358.4c6.4-12.8 6.4-25.6 12.8-38.4s12.8-25.6 19.2-32 12.8-19.2 25.6-25.6c12.8-6.4 25.6-6.4 38.4-6.4 12.8 0 25.6 0 38.4 6.4 12.8 6.4 19.2 12.8 25.6 25.6 6.4 6.4 12.8 19.2 19.2 32 6.4 12.8 12.8 25.6 19.2 44.8l140.8 352c12.8 25.6 19.2 44.8 19.2 57.6-6.4 6.4-12.8 19.2-19.2 32z m352-249.6c-70.4-25.6-121.6-57.6-166.4-96-44.8 44.8-102.4 76.8-172.8 96l-19.2-32c70.4-19.2 128-44.8 172.8-89.6-44.8-44.8-83.2-102.4-96-166.4h-64v-25.6h172.8c-12.8-19.2-25.6-44.8-38.4-64l19.2-6.4c12.8 19.2 32 44.8 44.8 70.4h160v32h-64c-19.2 64-51.2 121.6-89.6 160 44.8 38.4 96 70.4 166.4 89.6l-25.6 32z"
            p-id="6296"
          ></path>
        </svg>
        <span style={{ marginLeft: '8px' }}>{language}</span>
      </button>
      <div className="dropdown-content">
        <a
          onClick={() => {
            onChange({
              language: 'zh-CN',
              name: '简体中文',
            });
          }}
        >
          简体中文
        </a>
        <a
          onClick={() => {
            onChange({
              language: 'en-US',
              name: 'English',
            });
          }}
        >
          English
        </a>
      </div>
    </div>
  );
};

export default LanguageSwitch;
