import { useShallow } from 'zustand/shallow';

import { useBuilderStore } from '@/store/builder-store';

export const useBuilderActions = () =>
  useBuilderStore(
    useShallow((state) => ({
      clearSelection: state.clearSelection,
      selectElement: state.selectElement,
      updatePageSettings: state.updatePageSettings,
      updateElementSettings: state.updateElementSettings,
      updateElementData: state.updateElementData,
      updateElementImage: state.updateElementImage,
      resetTemplate: state.resetTemplate,
    })),
  );
