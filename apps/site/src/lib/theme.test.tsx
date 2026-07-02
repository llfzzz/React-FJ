import { describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from './theme';

function Probe() {
  const { mode, resolved, setMode } = useTheme();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="resolved">{resolved}</span>
      <button onClick={() => setMode('dark')}>go dark</button>
      <button onClick={() => setMode('system')}>go system</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  it('defaults to system and resolves light (mocked matchMedia)', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('mode')).toHaveTextContent('system');
    expect(screen.getByTestId('resolved')).toHaveTextContent('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('persists an explicit choice and applies it to the root element', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    await user.click(screen.getByText('go dark'));
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('fj-theme')).toBe('dark');
  });

  it('clears storage when returning to system', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    await user.click(screen.getByText('go dark'));
    await user.click(screen.getByText('go system'));
    expect(localStorage.getItem('fj-theme')).toBeNull();
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('reads a stored preference on mount', () => {
    localStorage.setItem('fj-theme', 'dark');
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    act(() => {});
  });
});
