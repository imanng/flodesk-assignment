import {
  type ElementBuilderSettingsProps,
  SettingsToggleControl,
} from '@/components/form';
import { FONT_WEIGHT_OPTIONS } from '@/constants/element-settings';
import { useBuilderActions } from '@/hooks/use-builder-actions';
import { useElementSelector } from '@/hooks/use-element-selector';

export const FontWeightField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const fontWeight = useElementSelector(templateId, elementId, (element) =>
    element?.type && element.type !== 'image' && element.type !== 'divider'
      ? (element.settings.fontWeight ?? 'normal')
      : 'normal',
  );
  const { updateElementSettings } = useBuilderActions();

  return (
    <SettingsToggleControl
      label="Font weight"
      className="element-settings__text-toggles"
      value={fontWeight}
      options={FONT_WEIGHT_OPTIONS.map((option) => ({
        value: option.value,
        content: option.content,
      }))}
      onChange={(value) =>
        updateElementSettings(templateId, elementId, { fontWeight: value })
      }
    />
  );
};
