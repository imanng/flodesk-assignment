import { Flex } from '@flodesk/grain';

import { TemplateBuilderHeader } from './header';
import { useTemplateBuilder } from './hooks';
import { Preview } from './preview';
import { Sidebar } from './sidebar';

export const TemplateBuilder = () => {
  const builderModel = useTemplateBuilder();

  if (!builderModel) return null;

  const { header, preview, sidebar } = builderModel;

  return (
    <Flex direction="column" height="100%" width="100%">
      <TemplateBuilderHeader
        onExportTemplate={header.onExportTemplate}
        onGoBack={header.onGoBack}
        onResetTemplate={header.onResetTemplate}
        templateName={header.templateName}
      />
      <Flex flex="1" overflow="auto" width="100%">
        <Preview
          onDeselectAll={preview.onDeselectAll}
          onSelectElement={preview.onSelectElement}
          pageSettings={preview.pageSettings}
          sectionIds={preview.sectionIds}
          templateId={preview.templateId}
        />
        <Sidebar
          elementId={sidebar.elementId}
          mode={sidebar.mode}
          templateId={sidebar.templateId}
          title={sidebar.title}
        />
      </Flex>
    </Flex>
  );
};
