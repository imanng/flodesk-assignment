import type { ReactNode } from "react";

export type SettingsSection<Props> = {
  id: string;
  items: SettingsItem<Props>[];
};

export type SettingsItem<Props> = {
  id: string;
  render: (props: Props) => ReactNode;
};

export const settingsItem = <Props>(
  id: string,
  render: (props: Props) => ReactNode,
): SettingsItem<Props> => ({
  id,
  render,
});
