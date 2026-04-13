import {
  Arrange,
  Box,
  Button,
  IconLink,
  IconUpload,
  Popover,
  Stack,
} from '@flodesk/grain';
import { useEffect, useState } from 'react';

import {
  type ElementBuilderSettingsProps,
  SettingsField,
  SettingsTextInputControl,
} from '@/components/form';
import { useBuilderActions } from '@/hooks/use-builder-actions';
import { useElementSelector } from '@/hooks/use-element-selector';
import { validateImageUrl } from '@/utils/sanitize';

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
  const { sanitizedValue: sanitizedUrlDraft, errorMessage } = validateImageUrl(urlDraft);
  const canApplyUrl = Boolean(sanitizedUrlDraft);

  useEffect(() => {
    setUrlDraft(src);
  }, [src]);

  const applyUrl = () => {
    if (!sanitizedUrlDraft) return;

    updateElementData(templateId, elementId, {
      src: sanitizedUrlDraft,
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
            <SettingsTextInputControl
              id={`image-url-${elementId}`}
              label="Image URL"
              type="url"
              value={urlDraft}
              errorMessage={errorMessage}
              onChange={setUrlDraft}
            />
            <Arrange gap="s" justifyContent="end">
              <Button variant="neutral" type="button" onClick={() => setUrlOpen(false)}>
                Cancel
              </Button>
              <Button variant="accent" type="button" onClick={applyUrl} disabled={!canApplyUrl}>
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
