import {
  Stack,
  Text,
  Box,
  TextToggleGroup,
  TextToggle,
  Icon,
  IconTextAlignLeft,
  IconTextAlignCenter,
  IconTextAlignRight,
} from '@flodesk/grain';
import { useBuilderStore } from '@/store/builder-store';
import type { ElementFieldProps } from '@/types/form';
import { useElementSelector } from '@/hooks/use-element-selector';

export const AlignmentField = ({ templateId, elementId }: ElementFieldProps) => {
  const textAlign = useElementSelector(templateId, elementId, (element) =>
    element?.type && element.type !== 'image' && element.type !== 'divider'
      ? element.settings.textAlign
      : 'left',
  );
  const updateElementSettings = useBuilderStore((s) => s.updateElementSettings);

  return (
    <Stack gap="xs" width="100%">
      <Text size="s" weight="medium" color="content2">Alignment</Text>
      <Box
        className="element-settings__text-toggles element-settings__text-toggles--align"
        width="100%"
      >
        <TextToggleGroup hasFullWidth>
          <TextToggle
            isActive={textAlign === 'left'}
            aria-label="Align left"
            onClick={() => updateElementSettings(templateId, elementId, { textAlign: 'left' })}
          >
            <Icon size="s" icon={<IconTextAlignLeft />} />
          </TextToggle>
          <TextToggle
            isActive={textAlign === 'center'}
            aria-label="Align center"
            onClick={() => updateElementSettings(templateId, elementId, { textAlign: 'center' })}
          >
            <Icon size="s" icon={<IconTextAlignCenter />} />
          </TextToggle>
          <TextToggle
            isActive={textAlign === 'right'}
            aria-label="Align right"
            onClick={() => updateElementSettings(templateId, elementId, { textAlign: 'right' })}
          >
            <Icon size="s" icon={<IconTextAlignRight />} />
          </TextToggle>
        </TextToggleGroup>
      </Box>
    </Stack>
  );
};
