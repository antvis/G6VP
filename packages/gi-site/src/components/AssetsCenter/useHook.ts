import { useDispatch } from 'react-redux';

const useAssetsCenter = (hash = 'components') => {
  const dispatch = useDispatch();
  const handleOpenAssetsCenter = () => {
    dispatch({
      type: 'update',
      assetsCenter: {
        visible: true,
        hash,
      },
    });
  };
  const handleCloseAssetsCenter = () => {
    dispatch({
      type: 'update',
      assetsCenter: {
        visible: false,
        hash: 'components',
      },
    });
  };
  return {
    handleOpenAssetsCenter,
    handleCloseAssetsCenter,
  };
};
export default useAssetsCenter;
