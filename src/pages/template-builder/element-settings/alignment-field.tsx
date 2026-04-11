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
import { useBuilderActions } from '@/hooks/use-builder-actions';
import { useElementSelector } from '@/hooks/use-element-selector';

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
  const textAlign = useElementSelector(templateId, elementId, (element) =>
    element?.type && element.type !== 'image' && element.type !== 'divider'
      ? element.settings.textAlign
      : 'left',
  );
  const { updateElementSettings } = useBuilderActions();

  return (
    <SettingsToggleControl
      label="Alignment"
      className="element-settings__text-toggles element-settings__text-toggles--align"
      value={textAlign}
      options={ALIGNMENT_OPTIONS}
      onChange={(value) =>
        updateElementSettings(templateId, elementId, { textAlign: value })
      }
    />
  );
};
