import { Arrange, FieldLabel, GhostInput, Stack } from '@flodesk/grain';
import { useEffect, useState } from 'react';

type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
  label?: string;
};

export const ColorPicker = ({ value, onChange, label }: ColorPickerProps) => {
  const hexValue = value.replace('#', '');
  const [draftValue, setDraftValue] = useState(hexValue);

  useEffect(() => {
    setDraftValue(hexValue);
  }, [hexValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleGhostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
    setDraftValue(raw);

    if (raw.length === 6) {
      onChange(`#${raw}`);
    }
  };

  return (
    <Stack gap="xs">
      {label ? <FieldLabel>{label}</FieldLabel> : null}
      <Arrange gap="s" alignItems="center">
        <input
          type="color"
          className="color-picker__swatch"
          value={value}
          onChange={handleInputChange}
        />
        <GhostInput
          prefix="#"
          value={draftValue}
          onChange={handleGhostChange}
        />
      </Arrange>
    </Stack>
  );
};
