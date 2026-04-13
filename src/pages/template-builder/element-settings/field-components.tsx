import { Arrange, Slider, Stack, Text } from '@flodesk/grain';
import { useEffect, useState } from 'react';

import {
  type ElementBuilderSettingsProps,
  SettingsColorControl,
  SettingsField,
  SettingsSelectControl,
  SettingsSliderControl,
  SettingsTextAreaControl,
  SettingsTextInputControl,
} from '@/components/form';
import { HEADING_LEVEL_OPTIONS, TARGET_OPTIONS } from '@/constants/element-settings';
import { useBuilderActions } from '@/hooks/use-builder-actions';
import { useElementSelector } from '@/hooks/use-element-selector';
import { clampNumber } from '@/utils/clamp';
import { formatSpacing, parsePx, parseSpacing, type SpacingSides } from '@/utils/parse-px';
import { validateLinkUrl } from '@/utils/sanitize';

type TextContentFieldProps = ElementBuilderSettingsProps & {
  rows: number;
};

export const TextContentField = ({
  templateId,
  elementId,
  rows,
}: TextContentFieldProps) => {
  const text = useElementSelector(templateId, elementId, (element) =>
    element?.type === 'text' || element?.type === 'heading'
      ? element.data.text
      : '',
  );
  const { updateElementData } = useBuilderActions();

  return (
    <SettingsTextAreaControl
      id={`content-${elementId}`}
      label="Content"
      value={text}
      rows={rows}
      onChange={(value) => updateElementData(templateId, elementId, { text: value })}
    />
  );
};

export const HeadingLevelField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const level = useElementSelector(templateId, elementId, (element) =>
    element?.type === 'heading' ? element.data.level : 1,
  );
  const { updateElementData } = useBuilderActions();

  return (
    <SettingsSelectControl
      label="Level"
      value={String(level)}
      options={HEADING_LEVEL_OPTIONS}
      onChange={(value) =>
        updateElementData(templateId, elementId, { level: Number(value) })
      }
    />
  );
};

export const ButtonLabelField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const label = useElementSelector(templateId, elementId, (element) =>
    element?.type === 'button' ? element.data.label : '',
  );
  const { updateElementData } = useBuilderActions();

  return (
    <SettingsTextInputControl
      id={`label-${elementId}`}
      label="Label"
      value={label}
      onChange={(value) => updateElementData(templateId, elementId, { label: value })}
    />
  );
};

export const ButtonHrefField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const href = useElementSelector(templateId, elementId, (element) =>
    element?.type === 'button' ? (element.data.href ?? '') : '',
  );
  const { updateElementData } = useBuilderActions();
  const [draftHref, setDraftHref] = useState(href);
  const { errorMessage } = validateLinkUrl(draftHref);

  useEffect(() => {
    setDraftHref(href);
  }, [href]);

  const handleChange = (value: string) => {
    setDraftHref(value);

    const nextValidation = validateLinkUrl(value);
    if (nextValidation.sanitizedValue) {
      updateElementData(templateId, elementId, { href: nextValidation.sanitizedValue });
    }
  };

  return (
    <SettingsTextInputControl
      id={`href-${elementId}`}
      label="Link URL"
      value={draftHref}
      errorMessage={errorMessage}
      onChange={handleChange}
    />
  );
};

export const ButtonTargetField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const target = useElementSelector(templateId, elementId, (element) =>
    element?.type === 'button' ? (element.data.target ?? '_self') : '_self',
  );
  const { updateElementData } = useBuilderActions();

  return (
    <SettingsSelectControl
      label="Open in"
      value={target}
      options={TARGET_OPTIONS}
      onChange={(value) => updateElementData(templateId, elementId, { target: value })}
    />
  );
};

export const ImageAltField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const alt = useElementSelector(templateId, elementId, (element) =>
    element?.type === 'image' ? element.data.alt : '',
  );
  const { updateElementData } = useBuilderActions();

  return (
    <SettingsTextInputControl
      id={`alt-${elementId}`}
      label="Alt text"
      value={alt}
      onChange={(value) => updateElementData(templateId, elementId, { alt: value })}
    />
  );
};

export const FontSizeField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const fontSize = useElementSelector(templateId, elementId, (element) =>
    element?.type && element.type !== 'image' && element.type !== 'divider'
      ? element.settings.fontSize
      : '12px',
  );
  const { updateElementSettings } = useBuilderActions();

  return (
    <SettingsSliderControl
      id={`font-size-${elementId}`}
      label="Font size"
      min={12}
      max={72}
      value={parsePx(fontSize, 12)}
      displayValue={fontSize}
      width={3}
      onChange={(value) =>
        updateElementSettings(templateId, elementId, {
          fontSize: `${value}px`,
        })
      }
    />
  );
};

export const TextColorField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const color = useElementSelector(templateId, elementId, (element) =>
    element?.type && element.type !== 'image' ? element.settings.color : '#000000',
  );
  const { updateElementSettings } = useBuilderActions();

  return (
    <SettingsColorControl
      label="Text color"
      value={color}
      onChange={(value) => updateElementSettings(templateId, elementId, { color: value })}
    />
  );
};

export const BackgroundColorField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const backgroundColor = useElementSelector(templateId, elementId, (element) =>
    element?.settings.backgroundColor,
  );
  const { updateElementSettings } = useBuilderActions();

  return (
    <SettingsColorControl
      label="Background color"
      value={(!backgroundColor || backgroundColor === 'transparent') ? '#ffffff' : backgroundColor}
      onChange={(value) =>
        updateElementSettings(templateId, elementId, {
          backgroundColor: value,
        })
      }
    />
  );
};

export const PaddingField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const padding = useElementSelector(templateId, elementId, (element) =>
    element?.settings.padding ?? '0px',
  );
  const { updateElementSettings } = useBuilderActions();
  const paddingSides = parseSpacing(padding, 0);

  const updatePaddingSide = (side: keyof SpacingSides, value: number) => {
    const nextPadding = formatSpacing({
      ...paddingSides,
      [side]: value,
    });

    updateElementSettings(templateId, elementId, {
      padding: nextPadding,
    });
  };

  const renderPaddingSlider = (
    side: keyof SpacingSides,
    label: string,
    value: number,
  ) => (
    <Arrange
      key={side}
      columns="56px 1fr auto"
      gap="s"
      alignItems="center"
      width="100%"
    >
      <Text size="s">{label}</Text>
      <Slider
        id={`padding-${side}-${elementId}`}
        min={0}
        max={64}
        value={clampNumber(value, 0, 64)}
        onChange={(event) => updatePaddingSide(side, event.target.valueAsNumber)}
      />
      <Text size="s" color="content3">
        {value}px
      </Text>
    </Arrange>
  );

  return (
    <SettingsField label="Padding">
      <Stack gap="s" paddingTop="s">
        {renderPaddingSlider('top', 'Top', paddingSides.top)}
        {renderPaddingSlider('right', 'Right', paddingSides.right)}
        {renderPaddingSlider('bottom', 'Bottom', paddingSides.bottom)}
        {renderPaddingSlider('left', 'Left', paddingSides.left)}
      </Stack>
    </SettingsField>
  );
};

export const BorderRadiusField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const borderRadius = useElementSelector(templateId, elementId, (element) =>
    element?.settings.borderRadius ?? '0px',
  );
  const { updateElementSettings } = useBuilderActions();

  return (
    <SettingsSliderControl
      id={`radius-${elementId}`}
      label="Border radius"
      min={0}
      max={32}
      value={parsePx(borderRadius, 0)}
      displayValue={borderRadius}
      width={3}
      onChange={(value) =>
        updateElementSettings(templateId, elementId, {
          borderRadius: `${value}px`,
        })
      }
    />
  );
};

export const DividerColorField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const color = useElementSelector(templateId, elementId, (element) =>
    element?.type === 'divider' ? element.settings.color : '#000000',
  );
  const { updateElementSettings } = useBuilderActions();

  return (
    <SettingsColorControl
      label="Divider color"
      value={color}
      onChange={(value) => updateElementSettings(templateId, elementId, { color: value })}
    />
  );
};
