import { Flex } from '@flodesk/grain';

import { TemplateBuilderHeader } from './header';
import { useTemplateBuilder } from './hooks';
import { Preview } from './preview';
import { Sidebar } from './sidebar';

export const TemplateBuilder = () => {
  const { state, actions } = useTemplateBuilder();
  const { templateId, templateName } = state;

  if (!templateId) return null;

  return (
    <Flex direction="column" height="100%" width="100%">
      <TemplateBuilderHeader
        templateName={templateName}
        onGoBack={actions.goBack}
        onExportTemplate={actions.exportTemplate}
        onResetTemplate={actions.resetTemplate}
      />
      <Flex flex="1" overflow="auto" width="100%">
        <Preview
          templateId={templateId}
          onDeselectAll={actions.deselectAll}
          onSelectElement={actions.selectElement}
        />
        <Sidebar templateId={templateId} />
      </Flex>
    </Flex>
  );
};
