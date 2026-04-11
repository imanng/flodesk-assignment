import {
  type PageBuilderSettingsProps,
  SettingsColorControl,
  SettingsSelectControl,
  SettingsSliderControl,
} from '@/components/form';
import { FONT_PRESET_OPTIONS } from '@/constants/font-presets';
import { useBuilderActions } from '@/hooks/use-builder-actions';
import { usePageSettings } from '@/hooks/use-page-settings';
import type { PageSettings } from '@/types/template';
import { parsePx } from '@/utils/parse-px';

export const PageBackgroundColorField = ({
  templateId,
}: PageBuilderSettingsProps) => {
  const backgroundColor = usePageSettings(
    templateId,
    (pageSettings) => pageSettings?.backgroundColor,
  );
  const { updatePageSettings } = useBuilderActions();

  return (
    <SettingsColorControl
      label="Background color"
      value={(!backgroundColor || backgroundColor === 'transparent') ? '#ffffff' : backgroundColor}
      onChange={(value) => updatePageSettings(templateId, { backgroundColor: value })}
    />
  );
};

export const PageTypographyField = ({ templateId }: PageBuilderSettingsProps) => {
  const fontPreset = usePageSettings(
    templateId,
    (pageSettings) => pageSettings?.fontPreset ?? 'modern-sans',
  );
  const { updatePageSettings } = useBuilderActions();

  return (
    <SettingsSelectControl
      label="Typography"
      value={fontPreset}
      options={FONT_PRESET_OPTIONS.map((option) => ({
        value: option.value,
        content: option.label,
      }))}
      onChange={(value) =>
        updatePageSettings(templateId, {
          fontPreset: value as PageSettings['fontPreset'],
        })
      }
    />
  );
};

export const PageMaxWidthField = ({ templateId }: PageBuilderSettingsProps) => {
  const maxWidth = usePageSettings(
    templateId,
    (pageSettings) => pageSettings?.maxWidth ?? '800px',
  );
  const { updatePageSettings } = useBuilderActions();

  return (
    <SettingsSliderControl
      id="max-width-slider"
      label="Max width"
      min={600}
      max={1200}
      step={20}
      value={parsePx(maxWidth, 800)}
      displayValue={maxWidth}
      onChange={(value) =>
        updatePageSettings(templateId, { maxWidth: `${value}px` })
      }
    />
  );
};
