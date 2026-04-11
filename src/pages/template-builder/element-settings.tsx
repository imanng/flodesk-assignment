import { useState } from 'react';
import {
  Box,
  Stack,
  Arrange,
  Text,
  TextInput,
  Textarea,
  Select,
  Slider,
  Button,
  Popover,
  TextToggleGroup,
  TextToggle,
  Icon,
  IconUpload,
  IconTextAlignLeft,
  IconTextAlignCenter,
  IconTextAlignRight,
  IconLink,
} from '@flodesk/grain';
import type { TemplateElement } from '@/types/template';
import { useBuilderStore } from '@/store/builder-store';
import { ColorPicker } from '@/components/color-picker';
import { sanitizeImageUrlForImgSrc } from '@/utils/sanitize';
import {
  FONT_WEIGHT_OPTIONS,
  HEADING_LEVEL_OPTIONS,
  TARGET_OPTIONS,
} from '@/constants/element-settings-options';

type ImageElement = Extract<TemplateElement, { type: 'image' }>;

interface ImageSourceFieldsProps {
  templateId: string;
  element: ImageElement;
  updateImageData: (tid: string, eid: string, patch: Record<string, unknown>) => void;
  updateElementImage: (tid: string, eid: string, file: File) => void;
}

function ImageSourceFields({
  templateId,
  element,
  updateImageData,
  updateElementImage,
}: ImageSourceFieldsProps) {
  const eid = element.id;
  const [urlOpen, setUrlOpen] = useState(false);
  const [urlDraft, setUrlDraft] = useState(element.data.src);

  const applyUrl = () => {
    const safe = sanitizeImageUrlForImgSrc(urlDraft);
    if (!safe) return;
    updateImageData(templateId, eid, {
      src: safe,
      source: 'url',
    });
    setUrlOpen(false);
  };

  return (
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
      <Arrange columns="repeat(2, 1fr)" gap="s">
        <Popover
          isOpen={urlOpen}
          onClose={() => setUrlOpen(false)}
          placement="bottom"
          hasPortal
          width="320px"
          trigger={(
            <Button
              icon={<IconLink />}
              variant="neutral"
              type="button"
              onClick={() => {
                setUrlDraft(element.data.src);
                setUrlOpen(true);
              }}
            >
              Set URL
            </Button>
          )}
        >
          <Stack gap="m">
            <Text size="s" weight="medium">Image URL</Text>
            <TextInput
              id={`image-url-${eid}`}
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
            />
            <Arrange gap="s" justifyContent="end">
              <Button variant="neutral" type="button" onClick={() => setUrlOpen(false)}>
                Cancel
              </Button>
              <Button variant="accent" type="button" onClick={applyUrl}>
                Apply
              </Button>
            </Arrange>
          </Stack>
        </Popover>
        <Button
          variant="neutral"
          icon={<IconUpload />}
          type="button"
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
          Upload
        </Button>
      </Arrange>
    </Stack>
  );
}

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
    <Stack gap="l" paddingX="l" paddingY="m" width="100%">
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
            <Text size="s" weight="medium" color="content2">Level</Text>
            <Select
              options={HEADING_LEVEL_OPTIONS}
              value={String(element.data.level)}
              onChange={(option) =>
                updateTextLikeData(templateId, eid, { level: Number(option.value) })
              }
            />
          </Stack>
          <Stack gap="xs">
            <Text size="s" weight="medium" color="content2">Content</Text>
            <Textarea
              id={`content-${eid}`}
              value={element.data.text}
              onChange={(e) => updateTextLikeData(templateId, eid, { text: e.target.value })}
              rows={3}
            />
          </Stack>
        </>
      )}

      {element.type === 'button' && (
        <>
          <Stack gap="xs">
            <Text size="s" weight="medium" color="content2">Label</Text>
            <Textarea
              id={`label-${eid}`}
              value={element.data.label}
              onChange={(e) =>
                updateTextLikeData(templateId, eid, { label: e.target.value })
              }
              rows={3}
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
          <ImageSourceFields
            templateId={templateId}
            element={element}
            updateImageData={updateImageData}
            updateElementImage={updateElementImage}
          />
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
            <Stack gap="xs" width="100%">
              <Text size="s" weight="medium" color="content2">Alignment</Text>
              <Box
                className="element-settings__text-toggles element-settings__text-toggles--align"
                width="100%"
              >
                <TextToggleGroup hasFullWidth>
                  <TextToggle
                    isActive={element.settings.textAlign === 'left'}
                    aria-label="Align left"
                    onClick={() =>
                      updateElementSettings(templateId, eid, { textAlign: 'left' })
                    }
                  >
                    <Icon size="s" icon={<IconTextAlignLeft />} />
                  </TextToggle>
                  <TextToggle
                    isActive={element.settings.textAlign === 'center'}
                    aria-label="Align center"
                    onClick={() =>
                      updateElementSettings(templateId, eid, { textAlign: 'center' })
                    }
                  >
                    <Icon size="s" icon={<IconTextAlignCenter />} />
                  </TextToggle>
                  <TextToggle
                    isActive={element.settings.textAlign === 'right'}
                    aria-label="Align right"
                    onClick={() =>
                      updateElementSettings(templateId, eid, { textAlign: 'right' })
                    }
                  >
                    <Icon size="s" icon={<IconTextAlignRight />} />
                  </TextToggle>
                </TextToggleGroup>
              </Box>
            </Stack>
          )}

          {element.type !== 'image' && (
            <Stack gap="xs" width="100%">
              <Text size="s" weight="medium" color="content2">Font weight</Text>
              <Box className="element-settings__text-toggles" width="100%">
                <TextToggleGroup hasFullWidth>
                  {FONT_WEIGHT_OPTIONS.map((opt) => (
                    <TextToggle
                      key={opt.value}
                      isActive={(element.settings.fontWeight ?? 'normal') === opt.value}
                      onClick={() =>
                        updateElementSettings(templateId, eid, { fontWeight: opt.value })
                      }
                    >
                      {opt.content}
                    </TextToggle>
                  ))}
                </TextToggleGroup>
              </Box>
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
