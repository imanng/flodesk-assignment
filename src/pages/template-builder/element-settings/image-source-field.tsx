import {
  Arrange,
  Box,
  Button,
  FieldLabel,
  IconLink,
  IconUpload,
  Popover,
  Stack,
  TextInput,
} from '@flodesk/grain';
import { useState } from 'react';

import {
  type ElementBuilderSettingsProps,
  SettingsField,
} from '@/components/form';
import { useBuilderActions } from '@/hooks/use-builder-actions';
import { useElementSelector } from '@/hooks/use-element-selector';
import { sanitizeImageUrlForImgSrc } from '@/utils/sanitize';

export const ImageSourceField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const src = useElementSelector(templateId, elementId, (element) =>
    element?.type === 'image' ? element.data.src : '',
  );
  const { updateElementData, updateElementImage } = useBuilderActions();
  const [urlOpen, setUrlOpen] = useState(false);
  const [urlDraft, setUrlDraft] = useState(src);

  const applyUrl = () => {
    const safe = sanitizeImageUrlForImgSrc(urlDraft);
    if (!safe) return;

    updateElementData(templateId, elementId, {
      src: safe,
      source: 'url',
    });
    setUrlOpen(false);
  };

  return (
    <SettingsField label="Image">
      <Box borderSide="all" radius="s" overflow="hidden">
        <img
          src={src}
          alt=""
          style={{
            width: '100%',
            height: '120px',
            display: 'block',
            objectFit: 'contain',
          }}
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
                setUrlDraft(src);
                setUrlOpen(true);
              }}
            >
              Set URL
            </Button>
          )}
        >
          <Stack gap="m">
            <FieldLabel htmlFor={`image-url-${elementId}`}>Image URL</FieldLabel>
            <TextInput
              id={`image-url-${elementId}`}
              value={urlDraft}
              onChange={(event) => setUrlDraft(event.target.value)}
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
              if (file) updateElementImage(templateId, elementId, file);
            };
            input.click();
          }}
        >
          Upload
        </Button>
      </Arrange>
    </SettingsField>
  );
};
