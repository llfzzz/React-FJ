import * as React from "react";

/**
 * Single-choice radio control, plus a RadioGroup convenience wrapper.
 *
 * @startingPoint section="Forms" subtitle="Single-choice radio & group" viewport="700x180"
 */
export interface RadioProps {
  checked?: boolean;
  onChange?: (value: string, e: React.ChangeEvent) => void;
  disabled?: boolean;
  label?: string;
  name?: string;
  value?: string;
}
export interface RadioOption { label: string; value: string; }
export interface RadioGroupProps {
  value?: string;
  onChange?: (value: string, e: React.ChangeEvent) => void;
  options?: Array<string | RadioOption>;
  name?: string;
}
export declare function Radio(props: RadioProps): JSX.Element;
export declare function RadioGroup(props: RadioGroupProps): JSX.Element;
