import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import { Box, IconDrag } from "@flodesk/grain";
import { memo, useCallback } from "react";

import {
  TemplatePreviewPage,
  TemplatePreviewSection,
} from "@/components/template-preview";
import {
  selectActiveElementId,
  selectActiveSectionId,
  selectTemplateSection,
} from "@/store/builder-selector";
import { useBuilderStore } from "@/store/builder-store";
import type { PageSettings } from "@/types/template";

export type PreviewProps = {
  onDeselectAll: () => void;
  onSelectElement: (elementId: string) => void;
  pageSettings: PageSettings;
  sectionIds: string[];
  templateId: string;
};

type ConnectedPreviewSectionProps = {
  onSelectElement: (elementId: string) => void;
  sectionId: string;
  templateId: string;
};

const ConnectedPreviewSection = memo(
  ({
    onSelectElement,
    sectionId,
    templateId,
  }: ConnectedPreviewSectionProps) => {
    const section = useBuilderStore((state) =>
      selectTemplateSection(state, templateId, sectionId),
    );
    const selectedElementId = useBuilderStore((state) =>
      selectActiveSectionId(state, templateId) === sectionId
        ? selectActiveElementId(state, templateId)
        : null,
    );

    if (!section) return null;

    return (
      <TemplatePreviewSection
        isInteractive
        onSelectElement={onSelectElement}
        section={section}
        selectedElementId={selectedElementId}
      />
    );
  },
);

type SortablePreviewSectionRowProps = {
  index: number;
  onSelectElement: (elementId: string) => void;
  sectionId: string;
  templateId: string;
};

const SortablePreviewSectionRow = memo(function SortablePreviewSectionRow({
  index,
  onSelectElement,
  sectionId,
  templateId,
}: SortablePreviewSectionRowProps) {
  const { handleRef, isDragSource, ref } = useSortable({
    id: sectionId,
    index,
  });

  return (
    <div
      ref={ref}
      className="preview-sortable-section"
      style={{
        opacity: isDragSource ? 0.92 : undefined,
      }}
    >
      <button
        ref={handleRef}
        type="button"
        className="preview-sortable-section__handle"
        aria-label="Drag to reorder section"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <IconDrag
          aria-hidden
          className="preview-sortable-section__grip-icon"
          height={20}
          width={10}
        />
      </button>
      <ConnectedPreviewSection
        onSelectElement={onSelectElement}
        sectionId={sectionId}
        templateId={templateId}
      />
    </div>
  );
});

const PreviewComponent = ({
  onDeselectAll,
  onSelectElement,
  pageSettings,
  sectionIds,
  templateId,
}: PreviewProps) => {
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (event.canceled || event.operation.canceled) return;
      const { source, target } = event.operation;
      if (!source || !target || !isSortable(source)) return;
      const fromIndex = source.initialIndex;
      const toIndex = source.index;

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

      useBuilderStore
        .getState()
        .reorderSections(templateId, fromIndex, toIndex);
    },
    [templateId],
  );

  if (sectionIds.length === 0) return null;

  return (
    <Box
      backgroundColor="background2"
      overflow="auto"
      padding="l"
      flex="1"
      height="100%"
      onClick={onDeselectAll}
    >
      <Box
        shadow="m"
        radius="m"
        overflow="hidden"
        backgroundColor="background"
        maxWidth="100%"
        margin="0 auto"
      >
        <TemplatePreviewPage pageSettings={pageSettings}>
          <DragDropProvider onDragEnd={handleDragEnd}>
            {sectionIds.map((sectionId, index) => (
              <SortablePreviewSectionRow
                key={sectionId}
                index={index}
                onSelectElement={onSelectElement}
                sectionId={sectionId}
                templateId={templateId}
              />
            ))}
          </DragDropProvider>
        </TemplatePreviewPage>
      </Box>
    </Box>
  );
};

export const Preview = memo(PreviewComponent);
