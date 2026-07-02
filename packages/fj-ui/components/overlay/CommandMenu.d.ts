import * as React from "react";

export interface Command {
  id?: string;
  label: React.ReactNode;
  /** Right-aligned hint / shortcut. */
  hint?: string;
  /** Lucide icon name. */
  icon?: string;
  group?: string;
  onRun?: () => void;
}

/** ⌘K-style searchable command palette. */
export interface CommandMenuProps {
  open: boolean;
  onClose?: () => void;
  commands: Command[];
  placeholder?: string;
}
export declare function CommandMenu(props: CommandMenuProps): JSX.Element;
