import React from "react";
import { Modal } from "./Modal.jsx";
import { Button } from "../core/Button.jsx";

/**
 * Free Joy — ConfirmDialog
 * A small Modal preset for confirm/cancel decisions. Set `danger` for
 * destructive actions; `loading` while the confirm handler runs.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  loading = false,
  width = 420,
  children,
}) {
  return (
    <Modal
      open={open}
      onClose={loading ? undefined : onClose}
      title={title}
      width={width}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
    </Modal>
  );
}
