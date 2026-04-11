import type { ReactNode } from "react";

export interface SettingsSection<Props> {
  id: string;
  items: SettingsItem<Props>[];
}

export interface SettingsItem<Props> {
  id: string;
  render: (props: Props) => ReactNode;
}

export const settingsItem = <Props>(
  id: string,
  render: (props: Props) => ReactNode,
): SettingsItem<Props> => ({
  id,
  render,
});
