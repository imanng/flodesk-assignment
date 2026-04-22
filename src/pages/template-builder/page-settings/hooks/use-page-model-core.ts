import { selectPageSettings } from '@/store/builder-selector';
import { useBuilderStore } from '@/store/builder-store';
import type { PageSettings } from '@/types/template';

export const usePageSettingsValue = <T,>(
  templateId: string,
  selector: (pageSettings: PageSettings | undefined) => T,
): T =>
  useBuilderStore((state) =>
    selector(selectPageSettings(state, templateId)),
  );

export const useHasPageSettings = (templateId: string): boolean =>
  usePageSettingsValue(templateId, (pageSettings) => Boolean(pageSettings));
