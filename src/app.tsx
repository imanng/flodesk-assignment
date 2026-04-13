import { Flex } from '@flodesk/grain';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { NotFound } from './pages/not-found';

const TemplateGallery = lazy(async () => {
  const module = await import('./pages/template-gallery');
  return { default: module.TemplateGallery };
});

const TemplateBuilderGuard = lazy(async () => {
  const module = await import('./components/template-builder-guard');
  return { default: module.TemplateBuilderGuard };
});

const RouteFallback = () => <Flex flex="1" width="100%" />;

export const App = () => (
  <Flex direction="column" height="100%" width="100%">
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<TemplateGallery />} />
        <Route path="/:id" element={<TemplateBuilderGuard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </Flex>
);
