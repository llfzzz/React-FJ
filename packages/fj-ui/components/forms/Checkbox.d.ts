import * as React from "react";

/** Checkbox with optional inline label. */
export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
