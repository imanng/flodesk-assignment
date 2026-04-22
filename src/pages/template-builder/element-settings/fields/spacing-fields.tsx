import { Arrange, Slider, Stack, Text } from '@flodesk/grain';
import { memo } from 'react';

import {
  type ElementBuilderSettingsProps,
  SettingsField,
  SettingsSliderControl,
} from '@/components/form';
import { clampNumber } from '@/utils/clamp';
import type { SpacingSides } from '@/utils/parse-px';
import { parsePx } from '@/utils/parse-px';

import {
  useBorderRadiusFieldModel,
  usePaddingFieldModel,
} from '../hooks/field-models';

type PaddingSide = keyof SpacingSides;

type PaddingSideSliderProps = {
  inputId: string;
  label: string;
  onChange: (side: PaddingSide, nextValue: number) => void;
  side: PaddingSide;
  value: number;
};

const PaddingSideSlider = memo(({
  inputId,
  label,
  onChange,
  side,
  value,
}: PaddingSideSliderProps) => (
  <Arrange
    columns="56px 1fr auto"
    gap="s"
    alignItems="center"
    width="100%"
  >
    <Text size="s">{label}</Text>
    <Slider
      id={inputId}
      min={0}
      max={64}
      value={clampNumber(value, 0, 64)}
      onChange={(event) => onChange(side, event.target.valueAsNumber)}
    />
    <Text size="s" color="content3">
      {value}px
    </Text>
  </Arrange>
));

export const PaddingField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const model = usePaddingFieldModel(templateId, elementId);

  return (
    <SettingsField label="Padding">
      <Stack gap="s" paddingTop="s">
        <PaddingSideSlider
          side="top"
          label="Top"
          inputId={`padding-top-${elementId}`}
          value={model.paddingSides.top}
          onChange={model.onChange}
        />
        <PaddingSideSlider
          side="right"
          label="Right"
          inputId={`padding-right-${elementId}`}
          value={model.paddingSides.right}
          onChange={model.onChange}
        />
        <PaddingSideSlider
          side="bottom"
          label="Bottom"
          inputId={`padding-bottom-${elementId}`}
          value={model.paddingSides.bottom}
          onChange={model.onChange}
        />
        <PaddingSideSlider
          side="left"
          label="Left"
          inputId={`padding-left-${elementId}`}
          value={model.paddingSides.left}
          onChange={model.onChange}
        />
      </Stack>
    </SettingsField>
  );
};

export const BorderRadiusField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const model = useBorderRadiusFieldModel(templateId, elementId);

  return (
    <SettingsSliderControl
      id={`radius-${elementId}`}
      label="Border radius"
      min={0}
      max={32}
      value={parsePx(model.value, 0)}
      displayValue={model.value}
      width={3}
      onChange={model.onChange}
    />
  );
};
