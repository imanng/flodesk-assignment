import type { PageSettings } from '@/types/template';
import { useBuilderStore } from '@/store/builder-store';

export const usePageSetting = <T,>(
  templateId: string,
  selector: (pageSettings: PageSettings | undefined) => T,
): T =>
  useBuilderStore((state) =>
    selector(state.templateMap[templateId]?.pageSettings),
  );
