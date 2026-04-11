import { useParams } from 'react-router-dom';
import { Flex } from '@flodesk/grain';
import { TemplateBuilderHeader } from './header';
import { Preview } from './preview';
import { Sidebar } from './sidebar';

export const TemplateBuilder = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;

  return (
    <Flex direction="column" className="template-builder">
      <TemplateBuilderHeader templateId={id} />
      <Flex className="template-builder__body" flex="1" overflow="auto" width="100%">
        <Preview templateId={id} />
        <Sidebar templateId={id} />
      </Flex>
    </Flex>
  );
};
