import {
  type ElementBuilderSettingsProps,
  SettingsToggleControl,
} from '@/components/form';
import { FONT_WEIGHT_OPTIONS } from '@/constants/element-settings';

import { useFontWeightFieldModel } from '../hooks/field-models';

export const FontWeightField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const model = useFontWeightFieldModel(templateId, elementId);

  return (
    <SettingsToggleControl
      label="Font weight"
      className="element-settings__text-toggles"
      value={model.value}
      options={FONT_WEIGHT_OPTIONS.map((option) => ({
        value: option.value,
        content: option.content,
      }))}
      onChange={model.onChange}
    />
  );
};
