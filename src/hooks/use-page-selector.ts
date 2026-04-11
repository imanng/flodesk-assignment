import { selectPageSettings, useBuilderStore } from '@/store/builder-store';
import type { PageSettings } from '@/types/template';

export const usePageSelector = <T,>(
  templateId: string,
  selector: (pageSettings: PageSettings | undefined) => T,
): T =>
  useBuilderStore((state) =>
    selector(selectPageSettings(state, templateId)),
  );
