import {
  Icon,
  IconTextAlignCenter,
  IconTextAlignLeft,
  IconTextAlignRight,
} from '@flodesk/grain';

import {
  type ElementBuilderSettingsProps,
  SettingsToggleControl,
  ToggleOption,
} from '@/components/form';

import { useAlignmentFieldModel } from '../hooks/field-models';

const ALIGNMENT_OPTIONS: ToggleOption<"left" | "right" | "center">[] = [
  {
    value: 'left',
    ariaLabel: 'Align left',
    content: <Icon size="s" icon={<IconTextAlignLeft />} />,
  },
  {
    value: 'center',
    ariaLabel: 'Align center',
    content: <Icon size="s" icon={<IconTextAlignCenter />} />,
  },
  {
    value: 'right',
    ariaLabel: 'Align right',
    content: <Icon size="s" icon={<IconTextAlignRight />} />,
  },
] as const;

export const AlignmentField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const model = useAlignmentFieldModel(templateId, elementId);

  return (
    <SettingsToggleControl
      label="Alignment"
      className="element-settings__text-toggles element-settings__text-toggles--align"
      value={model.value}
      options={ALIGNMENT_OPTIONS}
      onChange={model.onChange}
    />
  );
};
