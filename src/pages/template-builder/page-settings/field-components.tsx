import {
  type PageBuilderSettingsProps,
  SettingsColorControl,
  SettingsSelectControl,
  SettingsSliderControl,
} from '@/components/form';
import { FONT_PRESET_OPTIONS } from '@/constants/font-presets';
import type { PageSettings } from '@/types/template';
import { parsePx } from '@/utils/parse-px';

import {
  usePageBackgroundColorFieldModel,
  usePageMaxWidthFieldModel,
  usePageTypographyFieldModel,
} from './hooks/field-models';

export const PageBackgroundColorField = ({
  templateId,
}: PageBuilderSettingsProps) => {
  const model = usePageBackgroundColorFieldModel(templateId);

  return (
    <SettingsColorControl
      label="Background color"
      value={!model.value || model.value === 'transparent' ? '#ffffff' : model.value}
      onChange={model.onChange}
    />
  );
};

export const PageTypographyField = ({
  templateId,
}: PageBuilderSettingsProps) => {
  const model = usePageTypographyFieldModel(templateId);

  return (
    <SettingsSelectControl
      label="Typography"
      value={model.value}
      options={FONT_PRESET_OPTIONS.map((option) => ({
        value: option.value,
        content: option.label,
      }))}
      onChange={(nextValue) =>
        model.onChange(nextValue as PageSettings['fontPreset'])
      }
    />
  );
};

export const PageMaxWidthField = ({
  templateId,
}: PageBuilderSettingsProps) => {
  const model = usePageMaxWidthFieldModel(templateId);

  return (
    <SettingsSliderControl
      id="max-width-slider"
      label="Max width"
      min={600}
      max={1200}
      step={20}
      value={parsePx(model.value, 800)}
      displayValue={model.value}
      width={4.5}
      onChange={model.onChange}
    />
  );
};
