import {
  type ElementBuilderSettingsProps,
  SettingsSelectControl,
  SettingsTextAreaControl,
  SettingsTextInputControl,
} from '@/components/form';
import { HEADING_LEVEL_OPTIONS, TARGET_OPTIONS } from '@/constants/element-settings';

import {
  useButtonHrefFieldModel,
  useButtonLabelFieldModel,
  useButtonTargetFieldModel,
  useHeadingLevelFieldModel,
  useImageAltFieldModel,
  useTextContentFieldModel,
} from '../hooks/field-models';

type TextContentFieldProps = ElementBuilderSettingsProps & {
  rows: number;
};

export const TextContentField = ({
  templateId,
  elementId,
  rows,
}: TextContentFieldProps) => {
  const model = useTextContentFieldModel(templateId, elementId);

  return (
    <SettingsTextAreaControl
      id={`content-${elementId}`}
      label="Content"
      value={model.value}
      rows={rows}
      onChange={model.onChange}
    />
  );
};

export const HeadingLevelField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const model = useHeadingLevelFieldModel(templateId, elementId);

  return (
    <SettingsSelectControl
      label="Level"
      value={String(model.value)}
      options={HEADING_LEVEL_OPTIONS}
      onChange={model.onChange}
    />
  );
};

export const ButtonLabelField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const model = useButtonLabelFieldModel(templateId, elementId);

  return (
    <SettingsTextInputControl
      id={`label-${elementId}`}
      label="Label"
      value={model.value}
      onChange={model.onChange}
    />
  );
};

export const ButtonHrefField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const model = useButtonHrefFieldModel(templateId, elementId);

  return (
    <SettingsTextInputControl
      id={`href-${elementId}`}
      label="Link URL"
      value={model.value}
      errorMessage={model.errorMessage}
      onChange={model.onChange}
    />
  );
};

export const ButtonTargetField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const model = useButtonTargetFieldModel(templateId, elementId);

  return (
    <SettingsSelectControl
      label="Open in"
      value={model.value}
      options={TARGET_OPTIONS}
      onChange={model.onChange}
    />
  );
};

export const ImageAltField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const model = useImageAltFieldModel(templateId, elementId);

  return (
    <SettingsTextInputControl
      id={`alt-${elementId}`}
      label="Alt text"
      value={model.value}
      onChange={model.onChange}
    />
  );
};
