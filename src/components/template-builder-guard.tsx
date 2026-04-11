import { useParams } from 'react-router-dom';
import { useBuilderStore } from '@/store/builder-store';
import { TemplateBuilder } from '@/pages/template-builder';
import { NotFound } from '@/pages/not-found';

export const TemplateBuilderGuard = () => {
  const { id } = useParams<{ id: string }>();
  const hasTemplate = useBuilderStore((s) => (id ? Boolean(s.templateMap[id]) : false));

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
