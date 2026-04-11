import { useState } from 'react';
import {
  Stack,
  Text,
  TextInput,
  Arrange,
  Box,
  Button,
  Popover,
  IconLink,
  IconUpload,
} from '@flodesk/grain';
import { useBuilderStore } from '@/store/builder-store';
import { sanitizeImageUrlForImgSrc } from '@/utils/sanitize';
import type { ElementFieldProps } from '@/types/form';
import { useElementSelector } from '@/hooks/use-element-selector';

export const ImageSourceFields = ({ templateId, elementId }: ElementFieldProps) => {
  const src = useElementSelector(templateId, elementId, (element) =>
    element?.type === 'image' ? element.data.src : '',
  );
  const updateImageData = useBuilderStore((s) => s.updateImageData);
  const updateElementImage = useBuilderStore((s) => s.updateElementImage);
  const [urlOpen, setUrlOpen] = useState(false);
  const [urlDraft, setUrlDraft] = useState(src);

  const applyUrl = () => {
    const safe = sanitizeImageUrlForImgSrc(urlDraft);
    if (!safe) return;

    updateImageData(templateId, elementId, {
      src: safe,
      source: 'url',
    });
    setUrlOpen(false);
  };

  return (
    <Stack gap="xs">
      <Text size="s" weight="medium" color="content2">Image</Text>
      <Box borderSide="all" radius="s" overflow="hidden">
        <img
          src={src}
          alt=""
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
                setUrlDraft(src);
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
              id={`image-url-${elementId}`}
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
              if (file) updateElementImage(templateId, elementId, file);
            };
            input.click();
          }}
        >
          Upload
        </Button>
      </Arrange>
    </Stack>
  );
};
