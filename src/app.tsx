import { Routes, Route } from 'react-router-dom';
import { TemplateGallery } from './pages/template-gallery';
import { NotFound } from './pages/not-found';
import { TemplateBuilderGuard } from './components/template-builder-guard';

export const App = () => (
  <Routes>
    <Route path="/" element={<TemplateGallery />} />
    <Route path="/:id" element={<TemplateBuilderGuard />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
