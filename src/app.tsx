import { Flex } from '@flodesk/grain';
import { Route,Routes } from 'react-router-dom';

import { TemplateBuilderGuard } from './components/template-builder-guard';
import { NotFound } from './pages/not-found';
import { TemplateGallery } from './pages/template-gallery';

export const App = () => (
  <Flex direction="column" height="100%" width="100%">
    <Routes>
      <Route path="/" element={<TemplateGallery />} />
      <Route path="/:id" element={<TemplateBuilderGuard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Flex>
);
