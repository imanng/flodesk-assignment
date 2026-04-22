import {
  Arrange,
  Box,
  Button,
  IconLink,
  IconUpload,
  Popover,
  Stack,
} from '@flodesk/grain';

import {
  type ElementBuilderSettingsProps,
  SettingsField,
  SettingsTextInputControl,
} from '@/components/form';

import { useImageSourceFieldModel } from '../hooks/field-models';

export const ImageSourceField = ({
  templateId,
  elementId,
}: ElementBuilderSettingsProps) => {
  const model = useImageSourceFieldModel(templateId, elementId);

  return (
    <SettingsField label="Image">
      <Box borderSide="all" radius="s" overflow="hidden">
        <img
          src={model.src}
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
          isOpen={model.isUrlOpen}
          onClose={model.closeUrlPopover}
          placement="bottom"
          hasPortal
          width="320px"
          trigger={(
            <Button
              icon={<IconLink />}
              variant="neutral"
              type="button"
              onClick={model.openUrlPopover}
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
              value={model.urlDraft}
              errorMessage={model.errorMessage}
              onChange={model.setUrlDraft}
            />
            <Arrange gap="s" justifyContent="end">
              <Button
                variant="neutral"
                type="button"
                onClick={model.closeUrlPopover}
              >
                Cancel
              </Button>
              <Button
                variant="accent"
                type="button"
                onClick={model.applyUrl}
                disabled={!model.canApplyUrl}
              >
                Apply
              </Button>
            </Arrange>
          </Stack>
        </Popover>
        <Button
          variant="neutral"
          icon={<IconUpload />}
          type="button"
          onClick={model.onUpload}
        >
          Upload
        </Button>
      </Arrange>
    </SettingsField>
  );
};
