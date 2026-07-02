import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Showcase } from './Showcase';
import { buttonDoc } from '../registry/entries/button';

describe('Showcase', () => {
  it('renders the live preview with control defaults', () => {
    render(<Showcase doc={buttonDoc} />);
    expect(screen.getByRole('button', { name: 'Start free' })).toBeInTheDocument();
    expect(screen.queryByText('Reset')).not.toBeInTheDocument();
  });

  it('updates the generated code when a knob changes, and resets', async () => {
    const user = userEvent.setup();
    const { container } = render(<Showcase doc={buttonDoc} />);

    // variant has 4 options → chip group
    await user.click(screen.getByRole('button', { name: 'secondary' }));
    await user.click(screen.getByRole('tab', { name: 'Code' }));

    // Once shiki lands, the snippet is split across token spans — assert on
    // the block's combined text instead of a single text node.
    await waitFor(() => {
      expect(container.querySelector('.codeblock')?.textContent).toContain('variant="secondary"');
    });

    await user.click(screen.getByText('Reset'));
    await user.click(screen.getByRole('tab', { name: 'Preview' }));
    expect(screen.getByRole('button', { name: 'Start free' })).toBeInTheDocument();
  });

  it('reflects label edits in the preview', async () => {
    const user = userEvent.setup();
    render(<Showcase doc={buttonDoc} />);
    const input = screen.getByLabelText('Label');
    await user.clear(input);
    await user.type(input, 'Publish');
    expect(screen.getByRole('button', { name: 'Publish' })).toBeInTheDocument();
  });
});
