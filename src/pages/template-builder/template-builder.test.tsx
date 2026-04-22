import { GrainProvider } from '@flodesk/grain';
import { act, render, screen } from '@testing-library/react';
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

  it('confirms before resetting a template and preserves edits on cancel', async () => {
    const user = userEvent.setup();

    renderTemplateBuilder();

    await user.click(
      screen.getByRole('heading', {
        level: 1,
        name: /hi, i'?m/i,
      }),
    );

    expect(await screen.findByText('Heading Settings')).toBeInTheDocument();

    act(() => {
      useBuilderStore.getState().updateElementData('portfolio', 'about-text', {
        text: 'Draft about copy',
      });
    });

    expect(screen.getByText('Draft about copy')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Reset to defaults' }));

    expect(
      screen.getByText(
        /This will replace your current edits with the original template defaults\./i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/You can't undo this action\./i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(
      screen.queryByText(/This will replace your current edits with the original template defaults\./i),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Draft about copy')).toBeInTheDocument();
    expect(screen.getByText('Heading Settings')).toBeInTheDocument();
    expect(useBuilderStore.getState().selectedElementId).toBe('hero-heading');

    await user.click(screen.getByRole('button', { name: 'Reset to defaults' }));
    await user.click(screen.getByRole('button', { name: 'Reset' }));

    expect(
      await screen.findByText(/multidisciplinary designer and developer/i),
    ).toBeInTheDocument();
    expect(screen.queryByText('Draft about copy')).not.toBeInTheDocument();
    expect(await screen.findByText('Page Settings')).toBeInTheDocument();
    expect(useBuilderStore.getState().selectedElementId).toBeNull();
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
