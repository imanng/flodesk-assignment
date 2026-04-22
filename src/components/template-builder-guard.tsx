import { useParams } from 'react-router-dom';

import { NotFound } from '@/pages/not-found';
import { TemplateBuilder } from '@/pages/template-builder';
import { selectHasTemplate } from '@/store/builder-selector';
import { useBuilderStore } from '@/store/builder-store';

export const TemplateBuilderGuard = () => {
  const { id } = useParams<{ id: string }>();
  const hasTemplate = useBuilderStore((state) => selectHasTemplate(state, id));

  if (!hasTemplate) {
    return (
      <NotFound
        title="Template not found"
        description="That template is not in your gallery. Pick one from the home page."
      />
    );
  }

  return <TemplateBuilder />;
};
