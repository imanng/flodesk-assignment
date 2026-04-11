import { useParams, useNavigate } from 'react-router-dom';
import { Flex, Arrange, Text, TextButton, IconArrowLeft } from '@flodesk/grain';
import { useBuilderStore } from '@/store/builder-store';
import { Preview } from './preview';
import { Sidebar } from './sidebar';
import { ExportButton } from './export-button';

export function TemplateBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const template = useBuilderStore((s) => (id ? s.templateMap[id] : undefined));
  const selectedElementId = useBuilderStore((s) => s.selectedElementId);
  const selectElement = useBuilderStore((s) => s.selectElement);

  if (!template) {
    return null;
  }

  return (
    <Flex direction="column" className="template-builder">
      <Arrange
        columns="1fr auto 1fr"
        alignItems="center"
        paddingX="l"
        borderSide="bottom"
        backgroundColor="background"
        width="100%"
        height={7}
      >
        <Flex justifyContent="start">
          <TextButton
            icon={<IconArrowLeft />}
            onClick={() => {
              selectElement(null);
              navigate('/');
            }}
          >
            Back
          </TextButton>
        </Flex>

        <Text weight="medium" size="l" hasEllipsis>{template.name}</Text>

        <Flex justifyContent="end">
          <ExportButton template={template} />
        </Flex>
      </Arrange>

      <Flex className="template-builder__body" flex="1" overflow="auto" width="100%">
        <Preview
          template={template}
          selectedElementId={selectedElementId}
          onSelectElement={(eid) => selectElement(eid)}
          onDeselectAll={() => selectElement(null)}
        />
        <Sidebar
          template={template}
          selectedElementId={selectedElementId}
        />
      </Flex>
    </Flex>
  );
}
