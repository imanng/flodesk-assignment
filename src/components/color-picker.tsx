import { Stack, Arrange, Text, GhostInput } from '@flodesk/grain';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const hexValue = value.replace('#', '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleGhostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
    if (raw.length === 6) {
      onChange(`#${raw}`);
    }
  };

  return (
    <Stack gap="xs">
      {label && (
        <Text size="s" color="content2">{label}</Text>
      )}
      <Arrange gap="s" alignItems="center">
        <input
          type="color"
          className="color-picker__swatch"
          value={value}
          onChange={handleInputChange}
        />
        <GhostInput
          prefix="#"
          value={hexValue}
          onChange={handleGhostChange}
        />
      </Arrange>
    </Stack>
  );
}
