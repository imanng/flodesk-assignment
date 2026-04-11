import {
  type PageBuilderSettingsProps,
  settingsItem,
  type SettingsSection,
} from '@/components/form';

import {
  PageBackgroundColorField,
  PageMaxWidthField,
  PageTypographyField,
} from './field-components';

export const PAGE_SETTINGS_SECTIONS: SettingsSection<PageBuilderSettingsProps>[] = [
  {
    id: 'appearance',
    items: [
      settingsItem('page-background-color', (props) => (
        <PageBackgroundColorField {...props} />
      )),
    ],
  },
  {
    id: 'typography',
    items: [
      settingsItem('page-typography', (props) => <PageTypographyField {...props} />),
    ],
  },
  {
    id: 'layout',
    items: [
      settingsItem('page-max-width', (props) => <PageMaxWidthField {...props} />),
    ],
  },
];
