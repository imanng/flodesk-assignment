import {
  type ElementBuilderSettingsProps,
  SettingsColorControl,
  SettingsSliderControl,
} from '@/components/form';
import { parsePx } from '@/utils/parse-px';

import {
  useBackgroundColorFieldModel,
  useDividerColorFieldModel,
  useFontSizeFieldModel,
  useTextColorFieldModel,
} from '../hooks/field-models';

export const FontSizeField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const model = useFontSizeFieldModel(templateId, elementId);

  return (
    <SettingsSliderControl
      id={`font-size-${elementId}`}
      label="Font size"
      min={12}
      max={72}
      value={parsePx(model.value, 12)}
      displayValue={model.value}
      width={3}
      onChange={model.onChange}
    />
  );
};

export const TextColorField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const model = useTextColorFieldModel(templateId, elementId);

  return (
    <SettingsColorControl
      label="Text color"
      value={model.value}
      onChange={model.onChange}
    />
  );
};

export const BackgroundColorField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const model = useBackgroundColorFieldModel(templateId, elementId);

  return (
    <SettingsColorControl
      label="Background color"
      value={!model.value || model.value === 'transparent' ? '#ffffff' : model.value}
      onChange={model.onChange}
    />
  );
};

export const DividerColorField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const model = useDividerColorFieldModel(templateId, elementId);

  return (
    <SettingsColorControl
      label="Divider color"
      value={model.value}
      onChange={model.onChange}
    />
  );
};
