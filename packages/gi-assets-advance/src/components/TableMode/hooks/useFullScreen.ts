import { useState, useEffect } from 'react';

const useFullScreen = (): boolean => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  useEffect(() => {
    const onfullscreenchange = () => {
      setIsFullScreen(preState => !preState);
    };
    window.addEventListener('fullscreenchange', onfullscreenchange);

    return () => {
      window.removeEventListener('fullscreenchange', onfullscreenchange);
    };
  }, []);

  return isFullScreen;
};

export default useFullScreen;
