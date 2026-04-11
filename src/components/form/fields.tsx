import {
  Box,
  FieldLabel,
  Select,
  type SelectOption,
  Slider,
  Stack,
  Text,
  Textarea,
  TextInput,
  TextToggle,
  TextToggleGroup,
} from '@flodesk/grain';
import { type ReactNode } from 'react';

import { ColorPicker } from '@/components/color-picker';

export type PageBuilderSettingsProps = {
  templateId: string;
};

export type ElementBuilderSettingsProps = PageBuilderSettingsProps & {
  elementId: string;
};

export type ToggleOption<T extends string> = {
  value: T;
  content: ReactNode;
  ariaLabel?: string;
};

type SettingsFieldProps = {
  label: string;
  children: ReactNode;
  width?: string | number;
  htmlFor?: string;
};

export const SettingsField = ({
  label,
  children,
  width = '100%',
  htmlFor,
}: SettingsFieldProps) => (
  <Stack gap="xs" width={width}>
    <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
    {children}
  </Stack>
);

type SettingsTextAreaControlProps = {
  id: string;
  label: string;
  value: string;
  rows: number;
  onChange: (value: string) => void;
};

export const SettingsTextAreaControl = ({
  id,
  label,
  value,
  rows,
  onChange,
}: SettingsTextAreaControlProps) => (
  <SettingsField label={label} htmlFor={id}>
    <Textarea
      id={id}
      value={value}
      rows={rows}
      onChange={(event) =>
        onChange(event.target.value)
      }
    />
  </SettingsField>
);

type SettingsTextInputControlProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export const SettingsTextInputControl = ({
  id,
  label,
  value,
  onChange,
}: SettingsTextInputControlProps) => (
  <SettingsField label={label} htmlFor={id}>
    <TextInput
      id={id}
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
    />
  </SettingsField>
);

type SettingsSelectControlProps = {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
};

export const SettingsSelectControl = ({
  label,
  value,
  options,
  onChange,
}: SettingsSelectControlProps) => (
  <SettingsField label={label}>
    <Select
      options={options}
      value={value}
      onChange={(option) => onChange(option.value)}
    />
  </SettingsField>
);

type SettingsSliderControlProps = {
  id: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  displayValue: string;
  onChange: (value: number) => void;
};

export const SettingsSliderControl = ({
  id,
  label,
  min,
  max,
  step,
  value,
  displayValue,
  onChange,
}: SettingsSliderControlProps) => (
  <SettingsField label={label} htmlFor={id}>
    <Slider
      id={id}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) =>
        onChange(event.target.valueAsNumber)
      }
    />
    <Text size="s" color="content3">
      {displayValue}
    </Text>
  </SettingsField>
);

type SettingsColorControlProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export const SettingsColorControl = ({
  label,
  value,
  onChange,
}: SettingsColorControlProps) => (
  <SettingsField label={label}>
    <ColorPicker value={value} onChange={onChange} />
  </SettingsField>
);

type SettingsToggleControlProps<T extends string> = {
  label: string;
  value: T;
  options: ToggleOption<T>[];
  onChange: (value: T) => void;
  className?: string;
};

export const SettingsToggleControl = <T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: SettingsToggleControlProps<T>) => (
  <SettingsField label={label}>
    <Box className={className} width="100%">
      <TextToggleGroup hasFullWidth>
        {options.map((option) => (
          <TextToggle
            key={option.value}
            isActive={value === option.value}
            aria-label={option.ariaLabel}
            onClick={() => onChange(option.value)}
          >
            {option.content}
          </TextToggle>
        ))}
      </TextToggleGroup>
    </Box>
  </SettingsField>
);
