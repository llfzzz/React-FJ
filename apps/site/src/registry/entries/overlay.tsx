import { useState } from 'react';
import { Button, ConfirmDialog, Drawer, Input, Modal, Stack, type DrawerProps } from '@fj';
import type { ComponentDoc, ControlValues } from '../types';
import { impl } from '../impl';

function ModalDemo({ values }: { values: ControlValues }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={String(values.title)}
        glass={Boolean(values.glass)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Not now
            </Button>
            <Button onClick={() => setOpen(false)}>Publish quietly</Button>
          </>
        }
      >
        Your sketch goes to your circle only. You can unpublish any time.
      </Modal>
    </>
  );
}

export const modalDoc: ComponentDoc = {
  id: 'modal',
  name: 'Modal',
  category: 'feedback',
  blurb: 'A centered dialog for one focused decision — traps focus, restores it on close.',
  keywords: ['dialog', 'popup', 'confirm'],
  importLine: "import { Modal } from '@fj';",
  implementation: impl('modal'),
  controls: [
    { type: 'text', prop: 'title', defaultValue: 'Publish this sketch?' },
    { type: 'boolean', prop: 'glass', defaultValue: false },
  ],
  render: (values) => <ModalDemo values={values} />,
  code: (v) => `const [open, setOpen] = useState(false);

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="${String(v.title)}"${v.glass ? '\n  glass' : ''}
  footer={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>Not now</Button>
      <Button onClick={publish}>Publish quietly</Button>
    </>
  }
>
  Your sketch goes to your circle only.
</Modal>`,
  examples: [
    {
      title: 'ConfirmDialog preset',
      description: 'The destructive two-button case, prewired.',
      render: () => <ConfirmDemo />,
      code: `<ConfirmDialog
  open={open}
  onClose={() => setOpen(false)}
  onConfirm={remove}
  title="Delete this sketchbook?"
  confirmLabel="Delete"
  danger
>
  Its 12 sketches move to the bin for 30 days.
</ConfirmDialog>`,
    },
  ],
  props: [
    { name: 'open', type: 'boolean', description: 'Controlled visibility.' },
    { name: 'onClose', type: '() => void', description: 'Escape, backdrop click, and the × call this.' },
    { name: 'title', type: 'string', description: 'Dialog heading and accessible name.' },
    { name: 'footer', type: 'ReactNode', description: 'Right-aligned actions.' },
    { name: 'width', type: 'number', defaultValue: '460', description: 'Max panel width in px.' },
    { name: 'glass', type: 'boolean', defaultValue: 'false', description: 'Frosted panel.' },
  ],
  a11y: [
    'role="dialog" + aria-modal; focus moves in on open and returns to the trigger on close.',
    'Tab cycles inside the panel; Escape closes.',
    'Keep one decision per dialog — stacked modals are a design smell.',
  ],
};

function ConfirmDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete sketchbook
      </Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        title="Delete this sketchbook?"
        confirmLabel="Delete"
        danger
      >
        Its 12 sketches move to the bin for 30 days.
      </ConfirmDialog>
    </>
  );
}

function DrawerDemo({ values }: { values: ControlValues }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open drawer
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side={values.side as DrawerProps['side']}
        title="Sketch details"
        footer={
          <Stack direction="row" gap={10} justify="flex-end">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </Stack>
        }
      >
        <Stack gap={16}>
          <Input label="Title" defaultValue="Morning pages" />
          <Input label="Tags" placeholder="ink, warm-up" />
        </Stack>
      </Drawer>
    </>
  );
}

export const drawerDoc: ComponentDoc = {
  id: 'drawer',
  name: 'Drawer',
  category: 'feedback',
  blurb: 'A panel that slides in from an edge — room for details without losing the page.',
  keywords: ['panel', 'slide', 'sheet'],
  importLine: "import { Drawer } from '@fj';",
  implementation: impl('drawer'),
  controls: [
    { type: 'select', prop: 'side', options: ['right', 'left', 'top', 'bottom'], defaultValue: 'right' },
  ],
  render: (values) => <DrawerDemo values={values} />,
  code: (v) => `const [open, setOpen] = useState(false);

<Drawer
  open={open}
  onClose={() => setOpen(false)}${v.side !== 'right' ? `\n  side="${String(v.side)}"` : ''}
  title="Sketch details"
  footer={<Button onClick={save}>Save</Button>}
>
  <Input label="Title" defaultValue="Morning pages" />
</Drawer>`,
  props: [
    { name: 'open', type: 'boolean', description: 'Controlled visibility.' },
    { name: 'onClose', type: '() => void', description: 'Escape, scrim click, and the × call this.' },
    { name: 'side', type: '"left" | "right" | "top" | "bottom"', defaultValue: '"right"', description: 'Anchored edge.' },
    { name: 'size', type: 'number', defaultValue: '380', description: 'Width or height in px.' },
    { name: 'title', type: 'ReactNode', description: 'Header text and accessible name.' },
    { name: 'footer', type: 'ReactNode', description: 'Pinned footer row.' },
  ],
  a11y: [
    'Focus is trapped inside while open and restored to the trigger on close.',
    'Escape and scrim click both dismiss; the panel is a labeled role="dialog".',
    'Bottom drawers suit mobile forms; keep touch targets 44px+.',
  ],
};
