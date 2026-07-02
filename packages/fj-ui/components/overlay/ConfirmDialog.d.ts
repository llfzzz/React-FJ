import * as React from "react";

/**
 * Modal preset for confirm/cancel decisions.
 */
export interface ConfirmDialogProps {
  open?: boolean;
  /** Cancel / dismiss handler (Escape, backdrop, Cancel button). */
  onClose?: () => void;
  /** Confirm button handler. */
  onConfirm?: () => void;
  /** @default "Are you sure?" */
  title?: React.ReactNode;
  /** @default "Confirm" */
  confirmLabel?: React.ReactNode;
  /** @default "Cancel" */
  cancelLabel?: React.ReactNode;
  /** Destructive styling on the confirm button. @default false */
  danger?: boolean;
  /** Spinner on confirm; blocks dismissal while true. @default false */
  loading?: boolean;
  /** @default 420 */
  width?: number;
  /** Body copy. */
  children?: React.ReactNode;
}
export declare function ConfirmDialog(props: ConfirmDialogProps): JSX.Element;
