import {
  Box,
  Stack,
  Arrange,
  Text,
  TextInput,
  Textarea,
  Select,
  Slider,
  IconButton,
  Button,
  IconTextAlignLeft,
  IconTextAlignCenter,
  IconTextAlignRight,
  IconUpload,
} from '@flodesk/grain';
import type { TemplateElement } from '@/types/template';
import { useBuilderStore } from '@/store/builder-store';
import { ColorPicker } from '@/components/color-picker';

const FONT_WEIGHT_OPTIONS = [
  { value: 'normal', content: 'Normal' },
  { value: 'medium', content: 'Medium' },
  { value: 'bold', content: 'Bold' },
];

const HEADING_LEVEL_OPTIONS = [
  { value: '1', content: 'H1' },
  { value: '2', content: 'H2' },
  { value: '3', content: 'H3' },
];

const TARGET_OPTIONS = [
  { value: '_self', content: 'Same tab' },
  { value: '_blank', content: 'New tab' },
];

interface ElementSettingsProps {
  element: TemplateElement;
  templateId: string;
}

export function ElementSettings({ element, templateId }: ElementSettingsProps) {
  const {
    updateElementSettings,
    updateTextLikeData,
    updateImageData,
    updateElementImage,
  } = useBuilderStore();

  const eid = element.id;

  return (
    <Stack gap="l" paddingX="l" paddingY="m">
      {element.type === 'text' && (
        <Stack gap="xs">
          <Text size="s" weight="medium" color="content2">Content</Text>
          <Textarea
            id={`content-${eid}`}
            value={element.data.text}
            onChange={(e) => updateTextLikeData(templateId, eid, { text: e.target.value })}
            rows={4}
          />
        </Stack>
      )}

      {element.type === 'heading' && (
        <>
          <Stack gap="xs">
            <Text size="s" weight="medium" color="content2">Content</Text>
            <TextInput
              id={`content-${eid}`}
              value={element.data.text}
              onChange={(e) => updateTextLikeData(templateId, eid, { text: e.target.value })}
            />
          </Stack>
          <Stack gap="xs">
            <Text size="s" weight="medium" color="content2">Heading level</Text>
            <Select
              options={HEADING_LEVEL_OPTIONS}
              value={String(element.data.level)}
              onChange={(option) =>
                updateTextLikeData(templateId, eid, { level: Number(option.value) })
              }
            />
          </Stack>
        </>
      )}

      {element.type === 'button' && (
        <>
          <Stack gap="xs">
            <Text size="s" weight="medium" color="content2">Label</Text>
            <TextInput
              id={`label-${eid}`}
              value={element.data.label}
              onChange={(e) =>
                updateTextLikeData(templateId, eid, { label: e.target.value })
              }
            />
          </Stack>
          <Stack gap="xs">
            <Text size="s" weight="medium" color="content2">Link URL</Text>
            <TextInput
              id={`href-${eid}`}
              value={element.data.href ?? ''}
              onChange={(e) =>
                updateTextLikeData(templateId, eid, { href: e.target.value })
              }
            />
          </Stack>
          <Stack gap="xs">
            <Text size="s" weight="medium" color="content2">Open in</Text>
            <Select
              options={TARGET_OPTIONS}
              value={element.data.target ?? '_self'}
              onChange={(option) =>
                updateTextLikeData(templateId, eid, { target: option.value })
              }
            />
          </Stack>
        </>
      )}

      {element.type === 'image' && (
        <>
          <Stack gap="xs">
            <Text size="s" weight="medium" color="content2">Image</Text>
            <Box
              borderSide="all"
              radius="s"
              overflow="hidden"
            >
              <img
                src={element.data.src}
                alt={element.data.alt}
                style={{ width: '100%', height: '120px', display: 'block', objectFit: 'contain' }}
              />
            </Box>
            <Button
              icon={<IconUpload />}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = () => {
                  const file = input.files?.[0];
                  if (file) updateElementImage(templateId, eid, file);
                };
                input.click();
              }}
            >
              Change image
            </Button>
          </Stack>
          <Stack gap="xs">
            <Text size="s" weight="medium" color="content2">Alt text</Text>
            <TextInput
              id={`alt-${eid}`}
              value={element.data.alt}
              onChange={(e) =>
                updateImageData(templateId, eid, { alt: e.target.value })
              }
            />
          </Stack>
        </>
      )}

      {element.type !== 'divider' && (
        <>
          <Box borderSide="bottom" />

          {element.type !== 'image' && (
            <Stack gap="xs">
              <Text size="s" weight="medium" color="content2">Font size</Text>
              <Slider
                id={`font-size-${eid}`}
                min={12}
                max={72}
                value={parseInt(element.settings.fontSize, 10)}
                onChange={(e) =>
                  updateElementSettings(templateId, eid, {
                    fontSize: `${e.target.valueAsNumber}px`,
                  })
                }
              />
              <Text size="s" color="content3">{element.settings.fontSize}</Text>
            </Stack>
          )}

          {element.type !== 'image' && (
            <Stack gap="xs">
              <Text size="s" weight="medium" color="content2">Text color</Text>
              <ColorPicker
                value={element.settings.color}
                onChange={(color) =>
                  updateElementSettings(templateId, eid, { color })
                }
              />
            </Stack>
          )}

          <Stack gap="xs">
            <Text size="s" weight="medium" color="content2">Background color</Text>
            <ColorPicker
              value={element.settings.backgroundColor === 'transparent' ? '#ffffff' : element.settings.backgroundColor}
              onChange={(color) =>
                updateElementSettings(templateId, eid, { backgroundColor: color })
              }
            />
          </Stack>

          {element.type !== 'image' && (
            <Stack gap="xs">
              <Text size="s" weight="medium" color="content2">Alignment</Text>
              <Arrange gap="xs">
                <IconButton
                  icon={<IconTextAlignLeft />}
                  isActive={element.settings.textAlign === 'left'}
                  onClick={() =>
                    updateElementSettings(templateId, eid, { textAlign: 'left' })
                  }
                />
                <IconButton
                  icon={<IconTextAlignCenter />}
                  isActive={element.settings.textAlign === 'center'}
                  onClick={() =>
                    updateElementSettings(templateId, eid, { textAlign: 'center' })
                  }
                />
                <IconButton
                  icon={<IconTextAlignRight />}
                  isActive={element.settings.textAlign === 'right'}
                  onClick={() =>
                    updateElementSettings(templateId, eid, { textAlign: 'right' })
                  }
                />
              </Arrange>
            </Stack>
          )}

          {element.type !== 'image' && (
            <Stack gap="xs">
              <Text size="s" weight="medium" color="content2">Font weight</Text>
              <Select
                options={FONT_WEIGHT_OPTIONS}
                value={element.settings.fontWeight ?? 'normal'}
                onChange={(option) =>
                  updateElementSettings(templateId, eid, { fontWeight: option.value })
                }
              />
            </Stack>
          )}

          <Box borderSide="bottom" />

          <Stack gap="xs">
            <Text size="s" weight="medium" color="content2">Padding</Text>
            <Slider
              id={`padding-${eid}`}
              min={0}
              max={64}
              value={parseInt(element.settings.padding, 10) || 0}
              onChange={(e) =>
                updateElementSettings(templateId, eid, {
                  padding: `${e.target.valueAsNumber}px`,
                })
              }
            />
            <Text size="s" color="content3">{element.settings.padding}</Text>
          </Stack>

          {(element.type === 'button' || element.type === 'image') && (
            <Stack gap="xs">
              <Text size="s" weight="medium" color="content2">Border radius</Text>
              <Slider
                id={`radius-${eid}`}
                min={0}
                max={32}
                value={parseInt(element.settings.borderRadius ?? '0', 10)}
                onChange={(e) =>
                  updateElementSettings(templateId, eid, {
                    borderRadius: `${e.target.valueAsNumber}px`,
                  })
                }
              />
              <Text size="s" color="content3">{element.settings.borderRadius ?? '0px'}</Text>
            </Stack>
          )}
        </>
      )}

      {element.type === 'divider' && (
        <Stack gap="xs">
          <Text size="s" weight="medium" color="content2">Divider color</Text>
          <ColorPicker
            value={element.settings.color}
            onChange={(color) =>
              updateElementSettings(templateId, eid, { color })
            }
          />
        </Stack>
      )}
    </Stack>
  );
}
