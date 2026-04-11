import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { TemplateGallery } from './pages/template-gallery';
import { TemplateBuilder } from './pages/template-builder';
import { useBuilderStore } from './store/builder-store';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<TemplateGallery />} />
      <Route path="/:id" element={<TemplateBuilderGuard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function TemplateBuilderGuard() {
  const { id } = useParams<{ id: string }>();
  const templateMap = useBuilderStore((s) => s.templateMap);

  if (!id || !templateMap[id]) {
    return <Navigate to="/" replace />;
  }

  return <TemplateBuilder />;
}
