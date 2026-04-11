import { Stack } from '@flodesk/grain';
import { useElementSelector } from '@/hooks/use-element-selector';
import {
  AlignmentField,
  BackgroundColorField,
  BorderRadiusField,
  ButtonHrefField,
  ButtonLabelField,
  ButtonTargetField,
  DividerColorField,
  FieldSeparator,
  FontSizeField,
  FontWeightField,
  HeadingLevelField,
  ImageAltField,
  ImageSourceFields,
  PaddingField,
  TextColorField,
  TextContentField,
} from './fields';

interface ElementSettingsProps {
  elementId: string;
  templateId: string;
}

export const ElementSettings = ({ elementId, templateId }: ElementSettingsProps) => {
  const elementType = useElementSelector(
    templateId,
    elementId,
    (element) => element?.type,
  );

  if (!elementType) return null;

  return (
    <Stack gap="l" paddingX="l" paddingY="m" width="100%">
      {elementType === 'text' && (
        <TextContentField templateId={templateId} elementId={elementId} rows={4} />
      )}

      {elementType === 'heading' && (
        <>
          <HeadingLevelField templateId={templateId} elementId={elementId} />
          <TextContentField templateId={templateId} elementId={elementId} rows={3} />
        </>
      )}

      {elementType === 'button' && (
        <>
          <ButtonLabelField templateId={templateId} elementId={elementId} />
          <ButtonHrefField templateId={templateId} elementId={elementId} />
          <ButtonTargetField templateId={templateId} elementId={elementId} />
        </>
      )}

      {elementType === 'image' && (
        <>
          <ImageSourceFields templateId={templateId} elementId={elementId} />
          <ImageAltField templateId={templateId} elementId={elementId} />
        </>
      )}

      {elementType !== 'divider' && (
        <>
          <FieldSeparator />

          {elementType !== 'image' && (
            <FontSizeField templateId={templateId} elementId={elementId} />
          )}

          {elementType !== 'image' && (
            <TextColorField templateId={templateId} elementId={elementId} />
          )}

          <BackgroundColorField templateId={templateId} elementId={elementId} />

          {elementType !== 'image' && (
            <AlignmentField templateId={templateId} elementId={elementId} />
          )}

          {elementType !== 'image' && (
            <FontWeightField templateId={templateId} elementId={elementId} />
          )}

          <FieldSeparator />

          <PaddingField templateId={templateId} elementId={elementId} />

          {(elementType === 'button' || elementType === 'image') && (
            <BorderRadiusField templateId={templateId} elementId={elementId} />
          )}
        </>
      )}

      {elementType === 'divider' && (
        <DividerColorField templateId={templateId} elementId={elementId} />
      )}
    </Stack>
  );
};
