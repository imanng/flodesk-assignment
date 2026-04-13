import { GrainProvider } from '@flodesk/grain';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { resetBuilderStore } from '@/test/builder-store-helpers';

import { App } from './app';

const renderApp = (initialEntry = '/') =>
  render(
    <GrainProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <App />
      </MemoryRouter>
    </GrainProvider>,
  );

describe('App', () => {
  beforeEach(() => {
    resetBuilderStore();
  });

  it('renders the available templates in the gallery', async () => {
    renderApp();

    expect(await screen.findByText('Portfolio')).toBeInTheDocument();
    expect(await screen.findByText('Event Launch')).toBeInTheDocument();
    expect(await screen.findByText('Restaurant')).toBeInTheDocument();
  });

  it('shows a not found state for unknown template ids', async () => {
    renderApp('/missing-template');

    expect(await screen.findByText('Template not found')).toBeInTheDocument();
    expect(
      await screen.findByText(
        'That template is not in your gallery. Pick one from the home page.',
      ),
    ).toBeInTheDocument();
  });

  it('navigates from the gallery to the builder and updates the sidebar title when an element is selected', async () => {
    const user = userEvent.setup();

    renderApp();

    await user.click(await screen.findByText('Portfolio'));

    expect(await screen.findByText('Page Settings')).toBeInTheDocument();

    await user.click(
      screen.getByRole('heading', {
        level: 1,
        name: /hi, i'?m/i,
      }),
    );

    expect(await screen.findByText('Heading Settings')).toBeInTheDocument();
  });
});
