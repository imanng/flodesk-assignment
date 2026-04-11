import { Box } from '@flodesk/grain';
import { Fragment } from 'react';

import type { SettingsSection } from './config';

export const SettingsSections = <Props,>({
  sections,
  props,
}: {
  sections: SettingsSection<Props>[];
  props: Props;
}) => (
  <>
    {sections.map((section, sectionIndex) => (
      <Fragment key={section.id}>
        {sectionIndex > 0 ? <SettingsSeparator /> : null}
        {section.items.map((item) => (
          <Fragment key={`${section.id}-${item.id}`}>
            {item.render(props)}
          </Fragment>
        ))}
      </Fragment>
    ))}
  </>
);

export const SettingsSeparator = () => <Box borderSide="bottom" />;
