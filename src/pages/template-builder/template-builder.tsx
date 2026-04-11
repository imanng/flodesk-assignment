import { Flex } from '@flodesk/grain';
import { useParams } from 'react-router-dom';

import { TemplateBuilderHeader } from './header';
import { Preview } from './preview';
import { Sidebar } from './sidebar';

export const TemplateBuilder = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;

  return (
    <Flex direction="column" height="100%" width="100%">
      <TemplateBuilderHeader templateId={id} />
      <Flex flex="1" overflow="auto" width="100%">
        <Preview templateId={id} />
        <Sidebar templateId={id} />
      </Flex>
    </Flex>
  );
};
