import { Flex } from '@flodesk/grain';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useBuilderStore } from '@/store/builder-store';

import { TemplateBuilderHeader } from './header';
import { Preview } from './preview';
import { Sidebar } from './sidebar';

export const TemplateBuilder = () => {
  const { id } = useParams<{ id: string }>();
  const selectElement = useBuilderStore((state) => state.selectElement);

  useEffect(() => {
    selectElement(null);
  }, [id, selectElement]);

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
