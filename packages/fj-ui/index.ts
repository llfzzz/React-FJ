/**
 * Free Joy (FJ) Design System — local barrel.
 *
 * Synced from the "Free Joy Design System" Claude Design project
 * (id a42e56e8-d278-47e6-9679-38bc1fc507bb). This file is a LOCAL ADDITION
 * (upstream has no barrel); it only re-exports synced modules. Extend it as
 * more component families are pulled — never edit the synced sources.
 */

// core
export { Button } from "./components/core/Button";
export type { ButtonProps } from "./components/core/Button";
export { IconButton } from "./components/core/IconButton";
export type { IconButtonProps } from "./components/core/IconButton";
export { Card } from "./components/core/Card";
export type { CardProps } from "./components/core/Card";
export { Icon } from "./components/core/Icon";
export type { IconProps } from "./components/core/Icon";
export { Badge } from "./components/core/Badge";
export type { BadgeProps } from "./components/core/Badge";
export { Tag } from "./components/core/Tag";
export type { TagProps } from "./components/core/Tag";
export { Avatar } from "./components/core/Avatar";
export type { AvatarProps } from "./components/core/Avatar";
export { Divider } from "./components/core/Divider";
export type { DividerProps } from "./components/core/Divider";
export { Kbd } from "./components/core/Kbd";
export type { KbdProps } from "./components/core/Kbd";
export { StatusDot } from "./components/core/StatusDot";
export type { StatusDotProps } from "./components/core/StatusDot";
export { CopyButton } from "./components/core/CopyButton";
export type { CopyButtonProps } from "./components/core/CopyButton";
export { SplitButton } from "./components/core/SplitButton";
export type { SplitButtonProps, SplitButtonMenuItem } from "./components/core/SplitButton";
export { Fab } from "./components/core/Fab";
export type { FabProps } from "./components/core/Fab";
export { BackToTop } from "./components/core/BackToTop";
export type { BackToTopProps } from "./components/core/BackToTop";

// layout
export { Stack } from "./components/layout/Stack";
export type { StackProps } from "./components/layout/Stack";
export { Container } from "./components/layout/Container";
export type { ContainerProps } from "./components/layout/Container";
export { Grid } from "./components/layout/Grid";
export type { GridProps } from "./components/layout/Grid";
export { Text } from "./components/layout/Text";
export type { TextProps } from "./components/layout/Text";
export { AppShell } from "./components/layout/AppShell";
export type { AppShellProps } from "./components/layout/AppShell";
export { PageHeader } from "./components/layout/PageHeader";
export type { PageHeaderProps } from "./components/layout/PageHeader";
export { Toolbar } from "./components/layout/Toolbar";
export type { ToolbarProps } from "./components/layout/Toolbar";

// forms
export { Input } from "./components/forms/Input";
export type { InputProps } from "./components/forms/Input";
export { Textarea } from "./components/forms/Textarea";
export type { TextareaProps } from "./components/forms/Textarea";
export { Select } from "./components/forms/Select";
export type { SelectProps, SelectOption } from "./components/forms/Select";
export { Checkbox } from "./components/forms/Checkbox";
export type { CheckboxProps } from "./components/forms/Checkbox";
export { Radio, RadioGroup } from "./components/forms/Radio";
export type { RadioProps, RadioGroupProps, RadioOption } from "./components/forms/Radio";
export { Switch } from "./components/forms/Switch";
export type { SwitchProps } from "./components/forms/Switch";
export { Slider } from "./components/forms/Slider";
export type { SliderProps } from "./components/forms/Slider";

// navigation (partial)
export { Tabs } from "./components/navigation/Tabs";
export type { TabsProps, TabItem } from "./components/navigation/Tabs";
export { SegmentedControl } from "./components/navigation/SegmentedControl";
export type { SegmentedControlProps, SegmentOption } from "./components/navigation/SegmentedControl";

// feedback
export { Spinner } from "./components/feedback/Spinner";
export type { SpinnerProps } from "./components/feedback/Spinner";
export { Alert } from "./components/feedback/Alert";
export type { AlertProps } from "./components/feedback/Alert";
export { Tooltip } from "./components/feedback/Tooltip";
export type { TooltipProps } from "./components/feedback/Tooltip";
export { Progress } from "./components/feedback/Progress";
export type { ProgressProps } from "./components/feedback/Progress";
export { Skeleton } from "./components/feedback/Skeleton";
export type { SkeletonProps } from "./components/feedback/Skeleton";
export { Toast, ToastProvider, useToast } from "./components/feedback/Toast";
export type { ToastProps, ToastOptions, ToastProviderProps } from "./components/feedback/Toast";
export { EmptyState } from "./components/feedback/EmptyState";
export type { EmptyStateProps } from "./components/feedback/EmptyState";

// overlay (partial)
export { Modal } from "./components/overlay/Modal";
export type { ModalProps } from "./components/overlay/Modal";
export { ConfirmDialog } from "./components/overlay/ConfirmDialog";
export type { ConfirmDialogProps } from "./components/overlay/ConfirmDialog";
export { Drawer } from "./components/overlay/Drawer";
export type { DrawerProps } from "./components/overlay/Drawer";

// data (partial)
export { Table } from "./components/data/Table";
export type { TableProps, TableColumn } from "./components/data/Table";

// effects
export { TextReveal } from "./components/effects/TextReveal";
export type { TextRevealProps } from "./components/effects/TextReveal";
export { Reveal } from "./components/effects/Reveal";
export type { RevealProps } from "./components/effects/Reveal";
export { CountUp } from "./components/effects/CountUp";
export type { CountUpProps } from "./components/effects/CountUp";
export { SpotlightCard } from "./components/effects/SpotlightCard";
export type { SpotlightCardProps } from "./components/effects/SpotlightCard";
export { AnimatedBorder } from "./components/effects/AnimatedBorder";
export type { AnimatedBorderProps } from "./components/effects/AnimatedBorder";
export { Glow } from "./components/effects/Glow";
export type { GlowProps } from "./components/effects/Glow";
export { AmbientBackground } from "./components/effects/AmbientBackground";
export type { AmbientBackgroundProps } from "./components/effects/AmbientBackground";
