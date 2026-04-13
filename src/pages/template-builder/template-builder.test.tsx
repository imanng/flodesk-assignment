import { GrainProvider } from '@flodesk/grain';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  MemoryRouter,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { useBuilderStore } from '@/store/builder-store';
import { resetBuilderStore } from '@/test/builder-store-helpers';

import { TemplateBuilder } from './template-builder';

const RouteSwitcher = () => {
  const navigate = useNavigate();

  return (
    <button type="button" onClick={() => navigate('/event-launch')}>
      Go To Event Launch
    </button>
  );
};

const renderTemplateBuilder = () =>
  render(
    <GrainProvider>
      <MemoryRouter initialEntries={['/portfolio']}>
        <Routes>
          <Route
            path="/:id"
            element={(
              <>
                <RouteSwitcher />
                <TemplateBuilder />
              </>
            )}
          />
        </Routes>
      </MemoryRouter>
    </GrainProvider>,
  );

describe('TemplateBuilder', () => {
  beforeEach(() => {
    resetBuilderStore();
  });

  it('clears selection when navigating between templates', async () => {
    const user = userEvent.setup();

    renderTemplateBuilder();

    await user.click(
      screen.getByRole('heading', {
        level: 1,
        name: /hi, i'?m/i,
      }),
    );

    expect(await screen.findByText('Heading Settings')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Go To Event Launch' }));

    expect(await screen.findByText('Page Settings')).toBeInTheDocument();
    expect(screen.getByText('Background color')).toBeInTheDocument();
    expect(useBuilderStore.getState().selectedElementId).toBeNull();
  });
});
