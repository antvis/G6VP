import { useContext } from '../../pages/Analysis/hooks/useContext';

const useAssetsCenter = (hash = 'components') => {
  const { updateContext } = useContext();
  const handleOpenAssetsCenter = () => {
    updateContext(draft => {
      draft.assetsCenter = {
        visible: true,
        hash,
      };
    });
  };
  const handleCloseAssetsCenter = () => {
    updateContext(draft => {
      draft.assetsCenter = {
        visible: false,
        hash: 'components',
      };
    });
  };
  return {
    handleOpenAssetsCenter,
    handleCloseAssetsCenter,
  };
};
export default useAssetsCenter;
